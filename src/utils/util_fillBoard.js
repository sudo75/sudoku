const { shuffleArray } = require('./misc.js');
const { arrayEqual2D } = require('./misc.js');

function isSafe(board, row, col, num) {
    
    //Boxes
    const superRow = Math.floor(row / 3) * 3;
    const superCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const row_ = superRow + i;
            const col_ = superCol + j;

            if (board[row_][col_] === num) return false;
        }
    }

    //Rows
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) return false;
    }

    //Columns
    for (let j = 0; j < 9; j++) {
        if (board[row][j] === num) return false;
    }

    return true;
}

function countSolutions(board) {
    let solutions = 0;
    const solveCell = (r, c) => {
        if (c > 8) {
            c = 0;
            r++;
        }

        if (r > 8) {
            solutions++;
            return false; // All cells are filled
        }

        const cell_value = board[r][c];

        // Skip through all filled cells until an empty cell is found
        if (cell_value === 0) {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            for (let num of numbers) { //Iterate through random values 1-9, testing if any work
                
                if (isSafe(board, r, c, num)) { // If a value works
                    
                    board[r][c] = num; // Fill the cell
                    if (solveCell(r, c + 1)) { //if the next cell can be filled
                        return true;
                    }

                    // Backtrack
                    board[r][c] = 0;

                }
            }

            return false; // If no values work, flase is returned, triggering a backtrack

        } else {
            return solveCell(r, c + 1);
        }

    }

    solveCell(0, 0);
    
    return solutions;
}

function solve(board) {    
    const solveCell = (r, c) => {
        if (c > 8) {
            c = 0;
            r++;
        }

        if (r > 8) {
            return true; // All cells are filled --- the return true bubbles up into above layers
        }

        const cell_value = board[r][c];

        // Skip through all filled cells until an empty cell is found
        if (cell_value === 0) {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            for (let num of numbers) { //Iterate through random values 1-9, testing if any work
                
                if (isSafe(board, r, c, num)) { // If a value works
                    
                    board[r][c] = num; // Fill the cell
                    if (solveCell(r, c + 1)) { //if the next cell can be filled
                        return true;
                    }

                    // Backtrack
                    board[r][c] = 0;

                }
            }

            return false; // If no values work, flase is returned, triggering a backtrack

        } else {
            return solveCell(r, c + 1);
        }

    }

    solveCell(0, 0);

    return board;
    
}

function fillBoard() { //default to empty grid if initial value is not specified
    const board = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0))
    
    const fill_recursively = (r, c) => {
        if (c > 8) {
            c = 0;
            r++;
        }

        if (r > 8) {
            return true; // All cells are filled
        }

        const cell_value = board[r][c];

        // Skip through all filled cells until an empty cell is found
        if (cell_value === 0) {
            const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            for (let num of numbers) { //Iterate through random values 1-9, testing if any work
                
                if (isSafe(board, r, c, num)) { // If a value works
                    
                    board[r][c] = num; // Fill the cell
                    if (fill_recursively(r, c + 1)) { //if the next cell can be filled
                        return true;
                    }

                    // Backtrack
                    board[r][c] = 0;

                }
            }

            return false; // If no values work, flase is returned, triggering a backtrack

        }

    }

    fill_recursively(0, 0);

    return board;
}

module.exports = {
    fillBoard,
    solve,
    countSolutions
};