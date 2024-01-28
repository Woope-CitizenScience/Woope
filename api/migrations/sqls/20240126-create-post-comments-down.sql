-- Drop Posts Table
DROP TABLE IF EXISTS posts;

-- Drop Comments Table
DROP TABLE IF EXISTS comments;

-- Drop the likes_count_trigger from the comment_likes table
DROP TRIGGER IF EXISTS comments_count_trigger ON comments;

-- Drop the update_likes_count function
DROP FUNCTION IF EXISTS update_comments_count();

-- Drop the likes_count_trigger from the comment_likes table
DROP TRIGGER IF EXISTS likes_count_trigger ON comment_likes;

-- Drop the update_likes_count function
DROP FUNCTION IF EXISTS update_likes_count();
