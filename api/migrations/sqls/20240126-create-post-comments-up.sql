-- Create Posts Table
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_updated BOOLEAN NOT NULL DEFAULT FALSE,
    comments_count INTEGER DEFAULT 0, 
    likes_count INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Comments Table
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    parent_comment_id INTEGER, -- This can be NULL for top-level comments
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create function to update the comments_count when a new comment is added
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    -- If a new comment is added, increment the comments_count of the respective post
    IF TG_OP = 'INSERT' AND NEW.is_active THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE post_id = NEW.post_id;
    -- If a comment is deleted (marked as inactive), decrement the comments_count
    ELSIF TG_OP = 'UPDATE' AND NEW.is_active IS DISTINCT FROM OLD.is_active THEN
        UPDATE posts
        SET comments_count = comments_count + CASE WHEN NEW.is_active THEN 1 ELSE -1 END
        WHERE post_id = NEW.post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that calls the update_comments_count function after insert or update of a comment
CREATE TRIGGER comments_count_trigger
AFTER INSERT OR UPDATE OF is_active ON comments
FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- Create function to update the likes_count when a like is added to or removed from a comment
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Check the operation type: INSERT or DELETE
    IF TG_OP = 'INSERT' THEN
        -- If a new like is added, increment the likes_count of the respective comment
        UPDATE comments SET likes_count = likes_count + 1 WHERE comment_id = NEW.comment_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- If a like is removed, decrement the likes_count
        UPDATE comments SET likes_count = likes_count - 1 WHERE comment_id = OLD.comment_id;
    END IF;
    RETURN NULL; -- For AFTER triggers, it is recommended to return NULL
END;
$$ LANGUAGE plpgsql;

-- Create trigger that calls the update_likes_count function after insert or delete on comment_likes
CREATE TRIGGER likes_count_trigger
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW EXECUTE FUNCTION update_likes_count();