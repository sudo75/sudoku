require('dotenv').config();

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Connect without selecting a database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true // needed to run multiple SQL statements in one query --- schema is multiple statements
});


// INITIALISE THE DATABASE
connection.query(fs.readFileSync(path.join(__dirname, '..', 'schemas', 'init.sql'), 'utf8'));

// Query the USER SCHEMA
connection.query(fs.readFileSync(path.join(__dirname, '..', 'schemas', 'user_schema.sql'), 'utf8'));

// Query the GAME SCHEMA
connection.query(fs.readFileSync(path.join(__dirname, '..', 'schemas', 'game_schema.sql'), 'utf8'));

// Finish connection
connection.end();