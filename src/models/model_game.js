const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/games.json');

exports.readGames = () => {
  const jsonData = fs.readFileSync(filePath, 'utf-8'); // returns string
  return JSON.parse(jsonData); // convert string into JSON
}

exports.createGame = () => { // ADD DATA PARAMS LATER
    const games = readGames();
    games.push(newGame);
    writeGames(games);
}

