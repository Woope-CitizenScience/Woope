import { fetchAPI } from "./fetch";

export const getComments = async (post_id: number) => {
    return fetchAPI(`/comments/post_id=${post_id}`, 'GET');
};

export const deleteComment = async (comment_id: number) => {
    return fetchAPI(`/comments/${comment_id}`, 'DELETE');
}

export const createComment = async (comment: string, user_id: number, post_id: number, parent_id: number = NaN) => {
    return fetchAPI(`/comments`, 'POST', { comment, user_id, post_id, parent_id});
}

export const updateComment = async (comment_id: number, comment: string) => {
    return fetchAPI(`/comments/${comment_id}`, 'PUT', { comment });
}