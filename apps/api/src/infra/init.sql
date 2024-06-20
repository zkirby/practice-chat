-- init.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS friends (
    id SERIAL PRIMARY KEY,
    user1_id INT,
    user2_id INT,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
);

