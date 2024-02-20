import mime from "mime";

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

async function fetchAPIWithFiles(endpoint: string, method: string = 'POST', data: { text: string, images: string[], pdfs: PdfFile[] }) {
    const formData = new FormData();
    formData.append('text', data.text);
    
    data.images.forEach((imageUri, index) => {
        formData.append(`image${index}`, {
            uri : imageUri,
            type: mime.getType(imageUri),
            name: imageUri.split("/").pop()
        } as unknown as Blob);
    });
    
    data.pdfs.forEach((pdf, index) => {
        formData.append(`pdf${index}`, { 
            uri: pdf.uri, 
            name: pdf.name, 
            type: 'application/pdf' 
        } as unknown as Blob);
    });

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
        method,
        body: formData,
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || response.statusText);
    }

    return await response.json();
}

async function fetchAPI(endpoint: string, method: string = 'GET', body: any = null) {
    const config: RequestInit = { 
        method,
        headers: { 'Content-Type': 'application/json' },
    };

    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || response.statusText);
    }

    return await response.json();
}

export const createPost = async (content: string, images: string[], pdfs: PdfFile[]) => {
    return fetchAPIWithFiles('/posts', 'POST', { text: content, images, pdfs } as any);
}

export const getAllPosts = async () => {
    return fetchAPI('/posts', 'GET');
}

export const getPostById = async (id: number) => {
    return fetchAPI(`/posts/${id}`, 'GET');
}

export const getPostByUserId = async (userId: number) => {
    return fetchAPI(`/posts/user/${userId}`, 'GET');
}

export const deletePost = async (id: number) => {
    return fetchAPI(`/posts/${id}`, 'DELETE');
}

export const updatePost = async (id: number, content: string) => {
    return fetchAPI(`/posts/${id}`, 'PUT', { content });
}

export const likePost = async (id: number) => {
    return fetchAPI(`/posts/${id}/like`, 'POST');
}

export const unlikePost = async (id: number) => {
    return fetchAPI(`/posts/${id}/like`, 'DELETE');
}