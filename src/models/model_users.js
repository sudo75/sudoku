const { userInfo } = require('os');
const db = require('../db/connection.js');

function createAccount(username, password) { // don't need async bc. a promise is explicitly returned
    return new Promise((resolve, reject) => {

        // Check if username already exists
        const checkSql = `SELECT * FROM users WHERE username = ?`;

        db.query(checkSql, [username], (err, rows) => {
            if (err) return reject(err);

            if (rows.length > 0) return reject(err);


            // Add new account
            const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
            const values = [
                username,
                password
            ];

            db.query(sql, values, (err, result) => {
                if (err) return reject(err);

                resolve();
            });

        });

        

    });
}

function login(username, password, sessionToken) {
    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM users WHERE username = ?`;

        db.query(sql, [username], (err, rows) => {
            if (err) return reject(err);

            if (rows[0].password !== password) reject(new Error('Incorrect username/password'));

            const tokenSql =`UPDATE users SET session_token = ?, session_created_at = ? WHERE username = ?`;

            const createdAt = new Date();

            db.query(tokenSql, [sessionToken, createdAt, username], (err, result) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function getUserIdByUsername(username) {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT id FROM users WHERE username = ?`;

        db.query(sql, [username], (err, rows) => {
            if (err) reject(err);

            if (rows.length === 0) return reject(new Error('Not found'));

            resolve(rows[0].id); // must access .id bc. it returns this: [ { id: num } ]
        });
    });
}

module.exports = {
    createAccount,
    login,
    getUserIdByUsername
}