-- Create Posts Table
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_updated BOOLEAN NOT NULL DEFAULT FALSE,
    comments_count INTEGER DEFAULT 0, 
    likes_count INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    org_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    -- FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

-- Create Comments Table
CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    parent_comment_id INTEGER,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at TIMESTAMP,
    likes_count INTEGER DEFAULT 0,
    org_id INTEGER,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    -- FOREIGN KEY (org_id) REFERENCES organizations(org_id)
);

-- Create enum for accepted media types
CREATE TYPE media_type_enum AS ENUM ('PDF', 'Image');

-- Create media_type Table
CREATE TABLE IF NOT EXISTS post_media (
    media_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    media_type media_type_enum NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- Create post_likes Table
CREATE TABLE IF NOT EXISTS post_likes (
    like_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create comment_likes Table
CREATE TABLE IF NOT EXISTS comment_likes (
    like_id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create function to update the comments_count when a comment is added or deleted
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    -- If a new comment is added, increment the comments_count of the respective post
    IF TG_OP = 'INSERT' AND NEW.is_active THEN
        UPDATE posts SET comments_count = comments_count + 1 
        WHERE post_id = NEW.post_id;
    -- If a comment is deleted, decrement the comments_count of the respective post
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts
        SET comments_count = comments_count - 1
        WHERE post_id = OLD.post_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle user deletion of comments
CREATE OR REPLACE FUNCTION soft_delete_comment()
RETURNS TRIGGER AS $$
BEGIN
    -- Mark the comment as inactive, set the deletion message, and record the deletion time
    UPDATE comments
    SET is_active = FALSE,
        content = 'Comment has been deleted',
        deleted_at = CURRENT_TIMESTAMP
    WHERE comment_id = OLD.comment_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update the likes_count when a like is added to or removed from a comment
CREATE OR REPLACE FUNCTION update_comment_likes_count()
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
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to set is_updated to true if a post has been updated
CREATE OR REPLACE FUNCTION set_post_is_updated()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.content <> NEW.content THEN
        NEW.is_updated = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Create function to update the likes_count when a like is added to or removed from a post
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Check the operation type: INSERT or DELETE
    IF TG_OP = 'INSERT' THEN
        -- If a new like is added, increment the likes_count of the respective post
        UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- If a like is removed, decrement the likes_count
        UPDATE posts SET likes_count = likes_count - 1 WHERE post_id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create function to update the modified_at column on post_media table whenever a row is updated or deleted.
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger that calls the update_modified_column function before updating or deleting a row in the post_media table.
CREATE TRIGGER update_post_media_modtime
BEFORE UPDATE ON post_media
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();


-- Create trigger that calls the update_comments_count function after user inserts a comment
CREATE TRIGGER comments_count_trigger
AFTER INSERT ON comments
FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- Create trigger that calls soft_delete_comment function after user deletes a comment
CREATE TRIGGER before_comment_delete
BEFORE DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION soft_delete_comment();

-- Create trigger that calls the update_likes_count function after insert or delete on comment_likes
CREATE TRIGGER likes_count_trigger
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW EXECUTE FUNCTION update_comment_likes_count();

-- Create trigger that calls the set_post_is_updated function after a post has been updated
CREATE TRIGGER post_update_trigger
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION set_post_is_updated();

CREATE TRIGGER post_likes_count_trigger
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW
EXECUTE FUNCTION update_post_likes_count();
