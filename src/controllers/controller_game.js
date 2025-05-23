const model_game = require('../models/model_game');
const model_games_info = require('../models/model_games_info');

const util_generateGame = require('../utils/util_generateGame');


function createGame(req, res) {

    //const difficulty = req.body.difficulty;
    const id = model_games_info.getProperty('nextGameID');

    const game_generated = util_generateGame.generateGame();

    const game = {
        puzzle: game_generated.puzzle,
        solution: game_generated.solution,
        id: id
    };

    model_game.createGame(game); // ADD DATA PARAMS LATER

    model_games_info.increment_nextGameID();
    
    res.status(201).json({ message: 'Game created successfully', game: game });
};

function getGameById (req, res) {
    const id = req.params.id;
    
    res.status(200).json({ message: 'Game fetched successfully' });
};

function updateGame (req, res) {
    const id = req.params.id;    

    res.status(200).json({ message: 'Game updated successfully' });
};

function deleteGame (req, res) {
    const id = req.params.id;    

    model_game.deleteGame(id);

    res.status(204).json({ message: 'Game deleted successfully' });
};

// Export functions
module.exports = {
    createGame,
    getGameById,
    updateGame,
    deleteGame
};