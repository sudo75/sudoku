const express = require('express');
const router = express.Router();
const verifySession = require('../middleware/verify_session.js');

//Define controllers
const controller_users = require('../controllers/controller_users');

// Route: POST /api/users - Create a new account
router.post('/create_account', controller_users.createAccount);

// Route: POST /api/users - Login
router.post('/login', controller_users.login);

// To check login status
router.get('/session', verifySession, (req, res) => {
    res.json({
        loggedIn: true
    });
});


module.exports = router;