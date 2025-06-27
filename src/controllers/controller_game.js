const model_game = require('../models/model_game');
const model_games_info = require('../models/model_games_info');

const util_fillBoard = require('../utils/util_fillBoard');


function createGame(req, res) {

    //const difficulty = req.body.difficulty;
    const id = model_games_info.getProperty('nextGameID');

    const filledBoard = util_fillBoard.fillBoard();
    
    const game = {
        puzzle: filledBoard,
        solution: filledBoard,
        id: id
    };

    model_game.createGame(game); // ADD DATA PARAMS LATER

    model_games_info.increment_nextGameID();
    
    res.status(201).json({ message: 'Game created successfully', puzzle: game.puzzle });
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