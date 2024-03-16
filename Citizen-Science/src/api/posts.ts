import { fetchAPI } from "./fetch";

export const createPost = async (user_id: number, content: string) => {
    console.log(user_id, content);
    return fetchAPI('/forum/posts', 'POST', { user_id, content });
}

export const getAllPosts = async () => {
    return fetchAPI('/forum/posts', 'GET');
}

export const getPostById = async (id: number) => {
    return fetchAPI(`/forum/posts/${id}`, 'GET');
}

export const getPostByUserId = async (userId: number) => {
    return fetchAPI(`/forum/posts/user/${userId}`, 'GET');
}

export const deletePost = async (id: number) => {
    return fetchAPI(`/posts/${id}`, 'DELETE');
}

export const updatePost = async (id: number, content: string) => {
    return fetchAPI(`/forum/posts/${id}`, 'PUT', { content });
}

export const likePost = async (id: number) => {
    return fetchAPI(`/forum/posts/${id}/like`, 'POST');
}

export const unlikePost = async (id: number) => {
    return fetchAPI(`/forum/posts/${id}/like`, 'DELETE');
}