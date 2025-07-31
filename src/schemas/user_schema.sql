CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username TEXT NOT NULL,
    `password` TEXT NOT NULL,

    session_token VARCHAR(255),
    session_created_at DATETIME
);