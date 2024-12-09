import { useContext, useEffect, useState } from 'react';
import { Comment, PostWithUsername } from '../api/types';
import { AccessToken } from '../util/token';
import { AuthContext } from '../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { getUserIdByPostId } from '../api/posts';

export const userCanDeleteComment = (comment: Comment) => {
    const { userToken, setUserToken } = useContext(AuthContext);
    const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
    const [parentPostUserId, setParentPostUserId] = useState<number | null>(null);
    useEffect(() => {
        fetchUserId();
    });
    const fetchUserId = async() => {
        const userId = await getUserIdByPostId(comment.post_id);
        setParentPostUserId(userId);
    }
    if(decodedToken === null){return false};
    return (
        decodedToken?.is_Admin ||
        decodedToken.user_id === parentPostUserId || 
        decodedToken.user_id === comment.user_id
    );
}