const express = require('express');
const router = express.Router();

//Define controllers
const controller_users = require('../controllers/controller_users');

// Route: POST /api/users - Create a new account
router.post('/create_account', controller_users.createAccount);

// Route: POST /api/users - Login
//router.post('/login', controller_users.login);


module.exports = router;