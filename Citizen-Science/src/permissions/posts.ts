import {AccessToken} from "../util/token";
import { PostWithUsername } from '../api/types';

/**
 * Checks if a user has the necessary permissions to create a post on the Community Forum.
 * This is determined by verifying if the user holds an Admin role.
 *
 * @param {AccessToken | null} user - The access token representing the user's identity and roles. 
 *                                     Pass `null` if no user is authenticated.
 * @returns {boolean} - `true` if the user is an Admin, `false` otherwise. 
 *                      Returns `false` if the input is `null`.
 */
export const userCanPost = (user: AccessToken | null) => {
    if(user === null){ return false; }
    return (
        user.user_role === 'Admin'
    );
}

/**
 * Checks if a user has the necessary permissions to delete a post on the Community Forum.
 * This is determined by verifying if the user holds an Admin role or if the post was created by the user.
 *
 * @param {AccessToken | null} user - The access token representing the user's identity and roles. 
 *                                     Pass `null` if no user is authenticated.
 * @returns {boolean} - `true` if the user is an Admin, `false` otherwise. 
 *                      Returns `false` if the input is `null`.
 */
export const userCanDeletePost = (user: AccessToken | null, post: PostWithUsername) => {
    if(user === null){ return false; }
    return(
        user.user_role === 'Admin' ||
        user.user_id === post.user_id
    );
}

/**
 * Checks if a user has the necessary permissions to edit a post on the Community Forum.
 * This is determined by verifying if the user holds an Admin role or if the post was created by the user.
 *
 * @param {AccessToken | null} user - The access token representing the user's identity and roles. 
 *                                     Pass `null` if no user is authenticated.
 * @returns {boolean} - `true` if the user is an Admin, `false` otherwise. 
 *                      Returns `false` if the input is `null`.
 */
export const userCanEditPost = (user: AccessToken | null, post: PostWithUsername) => {
    if(user === null){ return false; }
    return(
        user.user_role === 'Admin' ||
        user.user_id === post.user_id
    );
}

/**
 * Checks if a user has the necessary permissions to view the drop down menu a post on the Community Forum.
 * This is determined by verifying if the user holds an Admin role or if the post was created by the user.
 *
 * @param {AccessToken | null} user - The access token representing the user's identity and roles. 
 *                                     Pass `null` if no user is authenticated.
 * @returns {boolean} - `true` if the user is an Admin, `false` otherwise. 
 *                      Returns `false` if the input is `null`.
 */
export const userCanViewPostDropDown = (user: AccessToken | null, post: PostWithUsername) => {
    if(user === null){ return false; }
    return(
        user.user_role === 'Admin' ||
        user.user_id === post.user_id
    );
}