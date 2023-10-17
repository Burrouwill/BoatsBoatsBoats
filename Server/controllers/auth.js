var ProductController = require('../controllers/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const handleLogin = async(req, res) => {
    const { user, pwd } = req.body;
    const controller = new ProductController(res.locals.dburi,'users');
    // If we dont get both a username & password --> Send badrequest resp with msg
    if (!user || !pwd) return res.status(400).json({ 'message':'Valid email and password required.'}); 

    // Try to find username in DB
    const foundUser = await controller.getDataUser(user);
    
    // If we cant find it --> Unauthorised
    if (!foundUser) return res.status(401).json({ 'message':'Authentication failed. Please provide valid credentials to access this webpage.'})

    // Evaluate Password
    const match = await bcrypt.compare(pwd,foundUser.password);
    if (match){
        const roles = Object.values(foundUser.roles);
        // Create JWT Normal & Refresh
        const accessToken = jwt.sign(
            { "UserInfo": {
                "username": foundUser.username,
                "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '59s'} // Setting access token expiry here, set short for testing, needs to be updated to something reasonable later
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'} // Setting refesh token expiry here
        );

        // Update the user's refreshToken in the database
        await controller.updateRefreshToken(foundUser.username, refreshToken);
        
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000}); // Setting the refresh token as http only prevents it from being accessed by JavaScript, lil bit heaps better security. Much more secure than storing it in local storage or anything like that. 
        res.json({ accessToken })// Setting "secure: true" in cookie will mean it only can be sent via https! Mess up testing etc 
    } else {
        res.status(401).json({ 'message':'Authentication failed. Invalid password.'})
    }
}  

module.exports = { handleLogin }