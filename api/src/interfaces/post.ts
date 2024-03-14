export interface Post{
    post_id: number,
    user_id: number,
    content: string,
    created_at: Date,
    is_updated: boolean,
    comments_count: number, 
    likes_count: number,
    is_active: boolean,
}

export interface Comment {
    comment_id: number;
    post_id: number;
    parent_comment_id: number | null;
    user_id: number;
    content: string;
    created_at: Date;
    is_active: boolean;
    deleted_at: Date | null;
    likes_count: number;
}

export interface PostMedia {
    media_id: number;
    post_id: number;
    media_type: 'PDF' | 'Image';
    media_url: string;
    created_at: Date;
    updated_at: Date;
}

export interface PostLike {
    like_id: number;
    post_id: number;
    user_id: number;
    created_at: Date;
}

export interface CommentLike {
    like_id: number;
    comment_id: number;
    user_id: number;
    created_at: Date;
}