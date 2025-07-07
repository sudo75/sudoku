const model_game = require('../models/model_game');

const util_generateSudoku = require('../utils/util_generateSudoku');


async function createGame(req, res) {
    const difficulty = req.body.difficulty;

    if (typeof difficulty !== 'number') return res.status(200).json( {message: 'Difficulty not defined properly'} );
    if (difficulty < 0 || difficulty > 3) return res.status(200).json( {message: 'Difficulty not defined properly'} );;
    

    const sudoku = util_generateSudoku.generateSudoku(difficulty);
    
    const game = {
        base_puzzle: sudoku.puzzle,
        puzzle: sudoku.puzzle,
        solution: sudoku.solution,
        errors: 0,
        status: 1 // 0 = not started, 1 = playing, 2 = lost, 3 = win
    };

    const created_game = await model_game.createGame(game);
    res.status(201).json({ message: 'Game created successfully', puzzle: created_game.puzzle, id: created_game.id, status: created_game.status });

}

async function getPuzzleById (req, res) {
    const id = req.params.id;

    const puzzle = await model_game.readPuzzle(id);
    
    res.status(200).json({ message: 'Game fetched successfully',  puzzle: puzzle});
}

async function updateGame (req, res) {
    const id = req.params.id;

    let status = await model_game.getProperty(id, 'status');
    if (status === 0) return res.status(200).json( {message: 'Game has ended'} );

    const {row, col, input} = req.body;

    const solution = await model_game.readSolution(id);

    let valid;
    if (solution[row][col] === input) { // Check if entry is valid
        await model_game.inputValue(id, row, col, input);
        valid = true;
    } else {
        const errors = await model_game.getProperty(id, 'errors');
        await model_game.editProperty(id, 'errors', errors + 1);
        valid = false;

        if (errors + 1 >= 3) {
            await model_game.editProperty(id, 'status', 2);
        }
    }


    const puzzle = await model_game.readPuzzle(id);

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
    if (isComplete) await model_game.editProperty(id, 'status', 3);

    status = await model_game.getProperty(id, 'status');

    res.status(200).json({ message: 'Game updated successfully', puzzle: puzzle, valid: valid, status: status });
}

async function deleteGame (req, res) {
    const id = req.params.id;    

    await model_game.deleteGame(id);

    res.status(204).json({ message: 'Game deleted successfully' });
}

// Export functions
module.exports = {
    createGame,
    getPuzzleById,
    updateGame,
    deleteGame
};