CREATE TABLE Entries (
    entry_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    tips_total NUMERIC NOT NULL,
    num_transactions INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NULL
);

INSERT INTO Users(email, password)
VALUES ('test@test.com', 'test'),
VALUES ('test2@test.com', 'test2');

INSERT INTO Entries(user_id, tips_total, date, num_transactions)
VALUES (1, 100, '1970-01-01', 10);

-----------------

INSERT INTO Entries(user_id, tips_total, date, num_transactions)
VALUES (1, 120, '1970-01-02', 15),
(1, 150, '1970-01-02', 20);


INSERT INTO Entries(user_id, tips_total, date, num_transactions)
VALUES (2, 80, '1970-01-02', 6),
(2, 110, '1970-01-02', 10);