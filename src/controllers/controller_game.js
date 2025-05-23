const model_game = require('../models/model_game');

const util_generateGame = require('../utils/util_generateGame');


function createGame(req, res) {

    //const difficulty = req.body.difficulty;

    const game = util_generateGame.generateGame();

    model_game.createGame(game); // ADD DATA PARAMS LATER
    
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