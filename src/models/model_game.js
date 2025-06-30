const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/games.json');

function readGames() {
    const jsonData = fs.readFileSync(filePath, 'utf-8'); // returns string
    return JSON.parse(jsonData); // convert string into JSON
}

function writeGames(games) {
    fs.writeFileSync(filePath, JSON.stringify(games, null, 4)); // third arg sets indentation
}

function inputValue(id, row, col, value) {
    const games = readGames();

    games[id].puzzle[row][col] = value;

    writeGames(games);
}

function createGame(game) { // ADD DATA PARAMS LATER
    let games = readGames();
        
    games.push(game);
    
    writeGames(games);
}

function deleteGame(id) {
    let games = readGames();

    for (let i = 0; i < games.length; i++) {
        const game = games[i];

        const gameID = game.id;

        if (gameID === id) {
            games.splice(id, 1);
        }
    }

    writeGames(games);
}

function readPuzzle(id) {
    return readGames()[id].puzzle;
}

function readSolution(id) {
    return readGames()[id].solution;
}

// Export functions
module.exports = {
    readGames,
    writeGames,
    createGame,
    deleteGame,
    readPuzzle,
    readSolution,
    inputValue
};