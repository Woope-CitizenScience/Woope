export type PdfFile = {
	uri: string;
	name: string;
};

export type Post = {
	image: string[];
	text: string;
	id: string;
	pdfs: PdfFile[];
	comments: Comment[];
	timestamp: number;
};

export type Comment = {
	author: string;
	text: string;
};
