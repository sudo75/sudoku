const model_game = require('../models/model_game');
const model_games_info = require('../models/model_games_info');

const util_generateSudoku = require('../utils/util_generateSudoku');


function createGame(req, res) {
    const difficulty = req.body.difficulty;
    
    const id = model_games_info.getProperty('nextGameID');

    const sudoku = util_generateSudoku.generateSudoku(difficulty);
    
    const game = {
        base_puzzle: sudoku.puzzle,
        puzzle: sudoku.puzzle,
        solution: sudoku.solution,
        id: id,
        errors: 0,
        status: 1 // 0 = not started, 1 = playing, 2 = lost, 3 = win
    };

    model_game.createGame(game); // ADD DATA PARAMS LATER

    model_games_info.increment_nextGameID();
    
    res.status(201).json({ message: 'Game created successfully', puzzle: game.puzzle, id: game.id, status: game.status });
}

function getPuzzleById (req, res) {
    const id = req.params.id;

    const puzzle = model_game.readPuzzle(id);
    
    res.status(200).json({ message: 'Game fetched successfully',  puzzle: puzzle});
}

function updateGame (req, res) {
    const id = req.params.id;

    let status = model_game.getProperty(id, 'status');
    if (status === 0) return res.status(200).json( {message: 'Game has ended'} );

    const {row, col, input} = req.body;

    const solution = model_game.readSolution(id);

    let valid;
    if (solution[row][col] === input) { // Check if entry is valid
        model_game.inputValue(id, row, col, input);
        valid = true;
    } else {
        const errors = model_game.getProperty(id, 'errors');
        model_game.editProperty(id, 'errors', errors + 1);
        valid = false;

        if (errors + 1 >= 3) {
            model_game.editProperty(id, 'status', 2);
        }
    }


    const puzzle = model_game.readPuzzle(id);

    // Check if puzzle is complete
    const isComplete = (() => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (puzzle[i][j] !== solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    })();
    if (isComplete) model_game.editProperty(id, 'status', 3);

    status = model_game.getProperty(id, 'status');

    res.status(200).json({ message: 'Game updated successfully', puzzle: puzzle, valid: valid, status: status });
}

function deleteGame (req, res) {
    const id = req.params.id;    

    model_game.deleteGame(id);

    res.status(204).json({ message: 'Game deleted successfully' });
}

// Export functions
module.exports = {
    createGame,
    getPuzzleById,
    updateGame,
    deleteGame
};