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
	org_id: number;
	image: string[];
	content: string;
	pdfs: PdfFile[];
	comments: Comment[];
	timestamp: number;
	userName: string;
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
	org_id: number;
};

export type Organization = {
	org_id: number;
	text_description: string;
	name: string;
	tagline: string;
	image_path: string;
}
export interface OrganizationWithCategory {
	org_id: number,
	name: string,
	category_name: string,
}
export interface Category {
	category_id: number,
	name: string,
	description: string;
}
export type Resource = {
	resource_id: number;
	org_id: number;
	name: string;
	tagline: string;
	text_description: string;
	image_path: string;
}
export interface ResourceMedia {
	media_id: number,
	name: string;
	file_path: string;
	uri: string;
}
export interface Event {
	event_id: number,
	org_id: number,
	name: string,
	text_description: string,
	tagline: string,
	time_begin: Date,
	time_end: Date,
}