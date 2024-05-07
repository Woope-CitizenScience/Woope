-- Create User Following Table
CREATE TABLE user_follows (
  follower_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  following_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id) -- Composite primary key for unique follow relationships, Referencing the users table
);