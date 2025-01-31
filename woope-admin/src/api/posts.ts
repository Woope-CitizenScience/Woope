import { fetchAPI } from "./fetch";

export const getAllPosts = async (id: number) => {
    return fetchAPI(`/forum/posts/${id}`, 'GET');
}