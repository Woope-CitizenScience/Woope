import { fetchAPI } from "./fetch";

//  Fetch all posts
export const getPosts = async () => {
    return fetchAPI("/forum/posts");
};

//  Search posts by keyword
export const searchPosts = async (query: string) => {
    return fetchAPI(`/forum/posts?search=${query}`);
};

// Edit a post
export const updatePost = async (post_id: number, content: string) => {
    return fetchAPI(`/forum/posts/${post_id}`, "PUT", { content });
};

// Delete a post
export const deletePost = async (post_id: number) => {
    return fetchAPI(`/forum/posts/${post_id}`, "DELETE");
};
