export type PdfFile = {
	uri: string;
	name: string;
};

export type Post = {
	post_id: number;
	image: string[];
	text: string;
	pdfs: PdfFile[];
	comments: Comment[];
	timestamp: number;
};

export type PostWithUsername = {
	post_id: number;
	image: string[];
	content: string;
	pdfs: PdfFile[];
	comments: Comment[];
	timestamp: number;
	username: string;
	user_id: number;
	likes_count: number;
	likedPost: boolean;
}

export type Comment = {
	comment_id: number;
	content: string;
	created_at: Date;
	deleted_at: Date;
	is_active: boolean;
	likes_count: number;
	parent_comment_id: number;
	post_id: number;
	user_id: number;
	username: string;
	likedByUser?: boolean;
};

export type Organization = {
	org_id: number;
	description: string;
	name: string;
}
export interface OrganizationWithCategory{
    org_id: number,
    name: string,
    category_name: string,
}
export interface Category{
	category_id: number,
	name: string,
	description: string;
}
