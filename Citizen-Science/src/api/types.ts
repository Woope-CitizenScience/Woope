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

export type Comment = {
	comment_id: number;
	post_id: number;
	parent_comment_id: number;
	user_id: number;
	content: string;
	timestamp: number;
	is_active: boolean;
	deleted_at: number;
	likes_count: number;
};
