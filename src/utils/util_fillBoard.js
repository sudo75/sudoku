const { shuffleArray } = require('./misc.js');

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

function fillBoard(board = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0))) { //default to empty grid if initial value is not specified

    const fill_recursively = () => {

        //Iterate through all cells
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {

                const cell_value = board[r][c];

                // Skip through all filled cells until an empty cell is found
                if (cell_value === 0) {
                    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

                    for (let num of numbers) { //Iterate through random values 1-9, testing if any work
                        
                        if (isSafe(board, r, c, num)) { // If a value works
                            
                            board[r][c] = num; // Fill the cell
                            if (fill_recursively()) { //if the next cell can be filled
                                return true;
                            }

                            //Backtrack
                            board[r][c] = 0;

                        }
                    }

                    return false; // If no values work, flase is returned, triggering a backtrack

                }

            }
        }

        return true; // All cells are filled
    }
    
    fill_recursively();

    return board;
}

module.exports = {
    fillBoard
};