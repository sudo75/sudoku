const model_users = require('../models/model_users.js');

async function createAccount(req, res) {
    const { username, password } = req.body;

    await model_users.createAccount(username, password);

    res.status(201).json({ message: 'Account created successfully' });
}

module.exports = {
    createAccount
};