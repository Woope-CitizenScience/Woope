import { fetchAPI } from "./fetch";

// Create Post
export const createPost = async (
  user_id: number,
  org_id: number | null,
  content: string,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI('/forum/posts', 'POST', { user_id, org_id, content }, setUserToken);
};

// Get all posts
export const getAllPosts = async (
  id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}`, 'GET', null, setUserToken);
};

// Get posts with media
export const getAllPostsWithMedia = async (
  id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}/media`, 'GET', null, setUserToken);
};

// Get single post by ID
export const getPostById = async (
  id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}`, 'GET', null, setUserToken);
};

// Get posts by user ID
export const getPostByUserId = async (
  userId: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/user/${userId}`, 'GET', null, setUserToken);
};

// Delete post
export const deletePost = async (
  id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}`, 'DELETE', null, setUserToken);
};

// Update post
export const updatePost = async (
  id: number,
  content: string,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}`, 'PUT', { content }, setUserToken);
};

// Like a post
export const likePost = async (
  id: number,
  user_id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}/like`, 'POST', { user_id }, setUserToken);
};

// Unlike a post
export const unlikePost = async (
  id: number,
  user_id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}/like`, 'DELETE', { user_id }, setUserToken);
};

// Get likes for a post
export const getPostLikes = async (
  id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/${id}/likes`, 'GET', null, setUserToken);
};

// Get all posts liked by user
export const getUserLikedPosts = async (
  id: number,
  setUserToken: (token: string | null) => void
) => {
  return fetchAPI(`/forum/posts/user/${id}/likes`, 'GET', null, setUserToken);
};
