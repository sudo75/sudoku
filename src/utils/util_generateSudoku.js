const { fillBoard, solve, countSolutions } = require('./util_fillBoard.js');

function getPair(row, col) { // Indexing from 0
    const row2 = 8 - row;
    const col2 = 8 - col;
    
    return [{row: row, col: col}, {row: row2, col: col2}];
}

function generatePairs(quantity) {
    let pairs = [];

    let pairSeed = [];
    while(pairSeed.length < quantity){
        const randPairSeed = Math.floor(Math.random() * 41); // There are 41 pairs in a sudoku board
        
        if (pairSeed.indexOf(randPairSeed) === -1) {
            pairSeed.push(randPairSeed);

            const seed_row = Math.floor(randPairSeed / 9);
            const seed_col = randPairSeed % 9;
            
            pairs.push(getPair(seed_row, seed_col));
        }        
    }


    return pairs;
}

function generateSudoku() {
    let puzzle = fillBoard();

    const targetRemovals = 16; // pairs
    let removals = 0;
    let i = 0;
    const iterationLimit = 64;

    const removalPairs = generatePairs(41);

    while (removals < targetRemovals) {
        if (i >= iterationLimit) return;

        let deepCoppy_puzzle = JSON.parse(JSON.stringify(puzzle));

        const removal = removalPairs[i];

        deepCoppy_puzzle[removal[0].row][removal[0].col] = 0;
        deepCoppy_puzzle[removal[1].row][removal[1].col] = 0;

        if (countSolutions(deepCoppy_puzzle) === 1) {
            puzzle = JSON.parse(JSON.stringify(deepCoppy_puzzle));
            removals++;
        }

        i++;
    }

    const solution = solve(puzzle);

    //TEST
    const puzzleTwoSolutions = [
        [2, 9, 5, 7, 4, 3, 8, 6, 1],
        [4, 3, 1, 8, 6, 5, 9, 0, 0],
        [8, 7, 6, 1, 9, 2, 5, 4, 3],
        [3, 8, 7, 4, 5, 9, 2, 1, 6],
        [6, 1, 2, 3, 8, 7, 4, 9, 5],
        [5, 4, 9, 2, 1, 6, 7, 3, 8],
        [7, 6, 3, 5, 3, 4, 1, 8, 9],
        [9, 2, 8, 6, 7, 1, 3, 5, 4],
        [1, 5, 4, 9, 3, 8, 6, 0, 0]
    ];


    return {
        puzzle: puzzle,
        solution: solution
    };
}


module.exports = {
    generateSudoku
};