require('dotenv').config();

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Connect without selecting a database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true // needed to run multiple SQL statements in one query --- schema is multiple statements
});


connection.connect(err => {
    if (err) throw err;
    console.log('Ensuring DB existance...');

    connection.query(schema, (err, results) => { // Create DB -- the first querry param will take SQL code or a file with SLQ code
        if (err) throw err;
        console.log('Database and tables created (if not already exist).');
        connection.end();
    });
});
