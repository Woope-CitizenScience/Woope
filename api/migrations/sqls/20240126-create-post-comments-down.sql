-- Drop Triggers
DROP TRIGGER IF EXISTS likes_count_trigger ON comment_likes;
DROP TRIGGER IF EXISTS comments_count_trigger ON comments;
DROP TRIGGER IF EXISTS before_comment_delete ON comments;
DROP TRIGGER IF EXISTS post_update_trigger ON posts;

-- Drop Functions
DROP FUNCTION IF EXISTS update_likes_count();
DROP FUNCTION IF EXISTS update_comments_count();
DROP FUNCTION IF EXISTS soft_delete_comment();
DROP FUNCTION IF EXISTS set_post_is_updated();

-- Drop Tables
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;