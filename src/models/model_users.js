const db = require('../db/connection.js');

function createAccount(username, password) { // don't need async bc. a promise is explicitly returned
    return new Promise((resolve, reject) => {            

        const values = [
            username,
            password
        ];

        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

        db.query(sql, values, (err, result) => {
            if (err) return reject(err);

            try {
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });

    });
}

module.exports = {
    createAccount
}