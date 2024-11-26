import { Comment } from '../api/types';
import { AccessToken } from '../util/token';

export const userCanDeleteComment = (user: AccessToken | null, comment: Comment) => {
    if(user === null){return false};
    return (
        user?.user_role === 'Admin' ||
        user.user_id === comment.user_id
    );
}