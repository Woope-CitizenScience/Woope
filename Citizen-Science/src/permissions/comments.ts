import { Comment } from '../api/types';

export const userCanDeleteComment = (userId: Number, comment: Comment) => {
    return (
        userId === comment.user_id
    );
}