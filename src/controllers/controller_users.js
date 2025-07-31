const model_users = require('../models/model_users.js');

async function createAccount(req, res) {
    const { username, password } = req.body;

    await model_users.createAccount(username, password);

    res.status(201).json({ message: 'Account created successfully' });
}

async function login(req, res) {
    const { username, password } = req.body;

    const sessionToken = (() => {
        const tokenLength = 12;

        let token = '';
        for (let i = 0; i < tokenLength; i++) {
            token += Math.floor(Math.random() * 10);
        }
        
        return token;
    })();

    try {
        await model_users.login(username, password, sessionToken); // if the promise is rejected, it throws an error which is caught by the catch block

        // Username (logged-in account) cookie
        res.cookie('username', username, {
            httpOnly: true,
            secure: false, // HTTPS -- if on http, must be set to false for browser to store cookie
            sameSite: 'Strict',
            maxAge: 3600000 // one hour (in ms)
        });

        // Session token cookie
        res.cookie('session_token', sessionToken, {
            httpOnly: true,
            secure: false, // HTTPS -- if on http, must be set to false for browser to store cookie
            sameSite: 'Strict',
            maxAge: 3600000 // one hour (in ms)
        });

        res.status(201).json({ sessionToken: sessionToken, message: 'Login successful' });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }

}

module.exports = {
    createAccount,
    login
};