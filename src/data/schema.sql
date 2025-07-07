CREATE DATABASE IF NOT EXISTS sudoku_app;
USE sudoku_app;

CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    base_puzzle TEXT NOT NULL, -- Unsolved puzzle
    puzzle TEXT NOT NULL, -- Puzzle as it is being solved
    solution TEXT NOT NULL, -- The solution
    errors INT,
    `status` INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);