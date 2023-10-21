var express = require('express');
var router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const sendRequest = require("../composables/sendRequest").sendRequest;
const request = require('request');

// Google OAuth - Entry point to Google Auth redirect
router.get('/auth/google', (req, res) => {
    // Forward the request to the Google OAuth microservice.
    res.redirect(`${process.env.OAUTH_SERVICE_URL}/auth/google`);
  });
module.exports = router;
