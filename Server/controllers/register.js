const usersDB = {
    users: require('../models/users.json'), //This should be retriving users from mongo (Currently using usersTESTjson to mock)
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
    const { user, pwd } = req.body;
    // If we dont get both a username & password --> Send badrequest resp with msg
    if (!user || !pwd) return res.status(400).json({ 'message':'Valid email and password required.'}); 
    
    // Perhaps we need a func to determine a valid email address if this is what we will be using as username? 

    // Check for duplicate usernames in DB
    const duplicate = usersDB.users.find(person => person.username === user)
    if (duplicate) return res.status(409).json({ 'message':'Email already taken.' });
    
    // We have a seeminly valid username & pass --> Encrypt & salt password
    try { 
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // Create new user & store in DB
        const newUser = { 'username': user, 'password': hashedPwd};
        usersDB.setUsers([...usersDB.users, newUser]); // (Creating a new array and seeting it in DB, this may need to change to using model when moving to mongo? )
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        
        // Announce Success
        console.log(usersDB.users);
        res.status(201).json({ 'Success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };