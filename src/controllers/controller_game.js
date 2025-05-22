const model_game = require('../models/model_game');

exports.createGame = (req, res) => {

    const difficulty = req.body.difficulty;

    model_game.createGame(); // ADD DATA PARAMS LATER
    
    res.status(201).json({ message: 'Game created successfully' });
};

exports.getGameById = (req, res) => {
    const id = req.params.id;
    
    res.status(200).json({ message: 'Game fetched successfully' });
};

exports.updateGame = (req, res) => {
    const id = req.params.id;    

    res.status(200).json({ message: 'Game updated successfully' });
};

exports.deleteGame = (req, res) => {
    const id = req.params.id;    

    res.status(204).json({ message: 'Game deleted successfully' });
};
