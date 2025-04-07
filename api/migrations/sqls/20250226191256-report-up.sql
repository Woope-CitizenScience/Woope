/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS reports (
    report_id SERIAL PRIMARY KEY,
    label VARCHAR(20) NOT NULL, 
    title VARCHAR(500),
    description VARCHAR(20)
);