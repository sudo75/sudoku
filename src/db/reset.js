require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) throw err;

    connection.query('DROP TABLE IF EXISTS games', (err, results) => {
        if (err) {
            throw err;
        }
        console.log('Games table cleared successfully.');
    });

    connection.query('DROP TABLE IF EXISTS users', (err, results) => {
        if (err) {
            throw err;
        }
        console.log('Users table cleared successfully.');
    });

    connection.end();
});