-- Create events table
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    location VARCHAR(300),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);