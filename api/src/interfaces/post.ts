export type PdfFile = {
	uri: string;
	name: string;
};

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

export interface PostWithUsername{
    post_id: number,
    user_id: number,
    username: string,
    content: string,
    created_at: Date,
    is_updated: boolean,
    comments_count: number,
    likes_count: number,
    is_active: boolean,
}

export interface PostWithMedia {
    post_id: number;
    user_id: number;
    username: string;
    content: string;
    created_at: Date;
    is_updated: boolean;
    comments_count: number;
    likes_count: number;
    is_active: boolean;
    media: PostMedia[];
}

export interface UserLikedPosts{
    post_id: number;
	image: string[];
	content: string;
	pdfs: PdfFile[];
	comments: Comment[];
	timestamp: number;
	username: string;
	likes_count: number;
	likedPost: boolean;
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