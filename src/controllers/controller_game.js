const model_game = require('../models/model_game');
const model_games_info = require('../models/model_games_info');

const util_generateSudoku = require('../utils/util_generateSudoku');


function createGame(req, res) {

    //const difficulty = req.body.difficulty;
    const id = model_games_info.getProperty('nextGameID');

    const sudoku = util_generateSudoku.generateSudoku();
    
    const game = {
        base_puzzle: sudoku.puzzle,
        puzzle: sudoku.puzzle,
        solution: sudoku.solution,
        id: id
    };

    model_game.createGame(game); // ADD DATA PARAMS LATER

    model_games_info.increment_nextGameID();
    
    res.status(201).json({ message: 'Game created successfully', puzzle: game.puzzle, id: game.id });
};

function getPuzzleById (req, res) {
    const id = req.params.id;

    const puzzle = model_game.readPuzzle(id);
    
    res.status(200).json({ message: 'Game fetched successfully',  puzzle: puzzle});
};

function updateGame (req, res) {
    const id = req.params.id;

    const {row, col, input} = req.body;

    const solution = model_game.readSolution(id);

    let valid;
    if (solution[row][col] === input) { // Check if entry is valid
        model_game.inputValue(id, row, col, input);
        valid = true;
    } else {
        valid = false;
    }

    const puzzle = model_game.readPuzzle(id);

    res.status(200).json({ message: 'Game updated successfully', puzzle: puzzle, valid: valid });
};

function deleteGame (req, res) {
    const id = req.params.id;    

    model_game.deleteGame(id);

    res.status(204).json({ message: 'Game deleted successfully' });
};

// Export functions
module.exports = {
    createGame,
    getPuzzleById,
    updateGame,
    deleteGame
};