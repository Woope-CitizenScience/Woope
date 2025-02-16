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

export const softDeletePost = async (post_id: number) => {
    return fetchAPI(`/forum/posts/soft/${post_id}`, "DELETE")
}

export const restorePost = async (post_id: number) => {
    return fetchAPI(`/forum/posts/restore/${post_id}`, "PUT");
}

export const getPostsByUserId = async (user_id: number) => {
    return fetchAPI(`/forum/posts/user/${user_id}`);
}

export const getPostsByOrgId = async (org_id: number) => {
    return fetchAPI(`/forum/posts/org/${org_id}`);
}
