-- Drop triggers if they exist
DROP TRIGGER IF EXISTS comments_count_trigger ON comments;
DROP TRIGGER IF EXISTS before_comment_delete ON comments;
DROP TRIGGER IF EXISTS likes_count_trigger ON comment_likes;
DROP TRIGGER IF EXISTS post_update_trigger ON posts;
DROP TRIGGER IF EXISTS post_likes_count_trigger ON post_likes;
DROP TRIGGER IF EXISTS update_post_media_modtime ON post_media;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_comments_count();
DROP FUNCTION IF EXISTS soft_delete_comment();
DROP FUNCTION IF EXISTS update_comment_likes_count();
DROP FUNCTION IF EXISTS set_post_is_updated();
DROP FUNCTION IF EXISTS update_post_likes_count();
DROP FUNCTION IF EXISTS update_modified_column();

-- Drop tables
DROP TABLE IF EXISTS comment_likes;
DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS post_media;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;