CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Foreign key to users.id
    base_puzzle TEXT NOT NULL, -- Unsolved puzzle
    puzzle TEXT NOT NULL, -- Puzzle as it is being solved
    solution TEXT NOT NULL, -- The solution
    errors INT,
    `status` INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);