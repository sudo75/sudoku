const db = require('../db_utils/db_util_game.js');

// For string storage in SQL
const serialise = (data) => JSON.stringify(data);
const deserialise = (data) => JSON.parse(data);


function createGame_callback(game, callback) {
    const values = [
        serialise(game.base_puzzle),
        serialise(game.puzzle),
        serialise(game.solution),
        game.errors,
        game.status
    ];

    const sql = `INSERT INTO games (base_puzzle, puzzle, solution, errors, status) VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, values, (err, result) => {
        if (err) return callback(err);

        game.id = result.insertId;
        callback(null, game);
    });
}

function createGame(game) { // don't need async bc. a promise is explicitly returned
    return new Promise((resolve, reject) => {            

        const values = [
            serialise(game.base_puzzle),
            serialise(game.puzzle),
            serialise(game.solution),
            game.errors,
            game.status
        ];

        const sql = `INSERT INTO games (base_puzzle, puzzle, solution, errors, status) VALUES (?, ?, ?, ?, ?)`;

        db.query(sql, values, (err, result) => {
            if (err) return reject(err);

            try {
                game.id = result.insertId; // insertID = game id in the SQL DB 

                resolve(game);
            } catch (err) {
                reject(err);
            }
        });

    });
}

function readPuzzle(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT puzzle FROM games WHERE id = ?';

        db.query(sql, [id], (err, result) => { // results = [{ puzzle: '[[...],[...]]' }]
            if (err) return reject(err);
            if (!result.length) return reject('game not found');

            try {
                const puzzle = deserialise(result[0].puzzle);
                resolve(puzzle);
            } catch (err) {
                reject(err);
            }

        });

    });
}

function readSolution(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT solution FROM games WHERE id = ?';

        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            if (!result.length) return reject('solution not found');

            try {
                const solution = deserialise(result[0].solution);
                resolve(solution);
            } catch (err) {
                reject(err);
            }

        });

    });
}

function getProperty(id, property) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT \`${property}\` FROM games WHERE id = ?`;

        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            if (!result.length) return reject('property not found');

            try {
                const property_value = deserialise(result[0][property]);
                resolve(property_value);
            } catch (err) {
                reject(err);
            }

        });

    });
}

function editProperty(id, property, value) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE games SET \`${property}\` = ? WHERE id = ?`;

        db.query(sql, [serialise(value), id], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}


async function inputValue(id, row, col, input) {
    const puzzle = await readPuzzle(id);

    puzzle[row][col] = input;

    await editProperty(id, 'puzzle', puzzle);
}

function deleteGame(id) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM games WHERE id = ?`;

        db.query(sql, [id], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Export functions
module.exports = {
    createGame,
    deleteGame,
    readPuzzle,
    readSolution,
    inputValue,
    getProperty,
    editProperty
};