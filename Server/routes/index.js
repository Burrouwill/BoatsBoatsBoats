var express = require('express');
var router = express.Router();
const axios = require('axios');

// Middleware 

var ProductController = require('../controllers/product');
const verifyJWT = require('../../Server/middleware/verifyJWT');
const ROLES_LIST = require('../config/rolesList');
const verifyRoles = require('../middleware/verifyRoles');
const retrieveUserInfo = require('../middleware/retrieveUserInfo');

router.get('/status', (_, res) => res.json({ status: 'OK' }).status(200));

router.get('/allProducts', retrieveUserInfo, async function(req, res) {
  const controller = new ProductController(res.locals.dburi,'products');
  const products = await controller.getAllData();
  res.json(products).status(200);
});

router.post('/product/insert', verifyJWT, verifyRoles(ROLES_LIST.Admin), async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'products');
  const id = await controller.insertData(req.body)
  res.json(id).status(200);
});

router.put('/product/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), async function (req, res, next) { 
  const controller = new ProductController(res.locals.dburi, 'products');
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/product/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async function (req, res, next) { 
  const controller = new ProductController(res.locals.dburi, 'products');

  const data = await controller.getData(req.params.id);
  if (data != null) {
    res.json(data).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }

});

router.delete('/product/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'products');
  const success = await controller.deleteData(req.params.id);
  if (success) {
    res.json({ message: 'success' }).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});


router.post('/orders/insert', verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), retrieveUserInfo, async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  req.body.userId = req.id;
  const id = await controller.insertData({ ...req.body, time: new Date() });
  res.json(id).status(200);
});

router.put('/orders/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/orders/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  const data = await controller.getData(req.params.id);
  if (data != null) {
    res.json(data).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});

router.delete('/orders/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  const success = await controller.deleteData(req.params.id);
  if (success) {
    res.json({ message: 'success' }).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});


/**********************************************
 *     User Authentication & Registration     *
 **********************************************/

const registerController = require('../controllers/register');
const authController = require('../controllers/auth');
const refreshTokenController = require('../controllers/refreshToken');
const logoutController = require('../controllers/logout');
const sendResetPasswordController = require('../controllers/sendResetPassword');
const adminController = require('../controllers/makeAdmin');

router.post('/register', registerController.handleNewUser);
router.post('/auth', authController.handleLogin);
router.get('/refresh', refreshTokenController.handleRefreshToken);
router.get('/logout', logoutController.handleLogout);
router.post('/sendResetPassword', sendResetPasswordController.sendResetPassword)
router.post('/resetPassword', retrieveUserInfo,sendResetPasswordController.setResetPassword);
router.put('/admin', verifyJWT, verifyRoles(ROLES_LIST.Admin), adminController.makeAdmin);

router.get('/finish/:refreshToken', async function(req, res) {
  const refreshToken = req.params.refreshToken;
 
  try {
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/');
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error calling /refresh:', error);
    res.status(500).send('Error calling /refresh');
  }

});

module.exports = router;
