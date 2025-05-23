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

function createGame(game) { // ADD DATA PARAMS LATER
    let games = readGames();
        
    games.push(game);
    
    writeGames(games);
}

function deleteGame(id) {
    let games = readGames();

    games.splice(id, 1);

    writeGames(games);
}

// Export functions
module.exports = {
    readGames,
    writeGames,
    createGame,
    deleteGame
};