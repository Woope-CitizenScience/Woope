import { fetchAPI } from "./fetch";

export const getComments = async (post_id: number) => {
    return fetchAPI(`/comments/post_id=${post_id}`, 'GET');
};

export const deleteComment = async (comment_id: number) => {
    return fetchAPI(`/comments/${comment_id}`, 'DELETE');
}

export const createComment = async (content: string, user_id: number, post_id: number, parent_comment_id: number = NaN) => {
    return fetchAPI(`/comments`, 'POST', { content, user_id, post_id, parent_comment_id});
}

export const updateComment = async (comment_id: number, content: string) => {
    console.log(comment_id);
    return fetchAPI(`/comments/${comment_id}`, 'PUT', { content });
}

export const likeComment = async (comment_id: number) => {
    return fetchAPI(`/comments/${comment_id}/like`, 'POST');
}

export const unlikeComment = async (comment_id: number) => {
    return fetchAPI(`/comments/${comment_id}/unlike`, 'DELETE');
}