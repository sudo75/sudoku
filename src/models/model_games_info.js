const fs = require('fs');
const path = require('path');

const gamesInfoPath = path.join(__dirname, '../data/games_info.json');

function readInfo() {
    const jsonData = fs.readFileSync(gamesInfoPath, 'utf-8'); // returns string
    return JSON.parse(jsonData); // convert string into JSON
}

function writeInfo(info) {
    fs.writeFileSync(gamesInfoPath, JSON.stringify(info, null, 4));
}

function setProperty(property, value) {
    const data = readInfo();

    data[property] = value;

    writeInfo(data);
}

function getProperty(property) {
    const data = readInfo();

    return data[property];
}

function increment_nextGameID() {
    const newValue = getProperty('nextGameID') + 1;
    setProperty('nextGameID', newValue);
}

module.exports = {
    getProperty,
    increment_nextGameID
};