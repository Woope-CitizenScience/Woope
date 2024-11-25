import jwt from 'jsonwebtoken';
import {User} from '../interfaces/User';
import {config} from "../config/config";

/**
 * Creates a refresh token for the specified user.
 *
 * This function generates a JSON Web Token (JWT) that contains the user's ID as the payload.
 * The token is signed using a secret and configured to expire in 7 days.
 *
 * @param user - An object representing the user for whom the refresh token is created. 
 *               It must contain a `user_id` property.
 * @returns A promise that resolves to a JWT refresh token string.
 */
export const createRefreshToken = async (user: User) => {
    return jwt.sign(
        {
            user_id: user.user_id,
        },
        config.refreshTokenSecret!,
        {
            expiresIn: `7d`
        }
    );
};

/**
 * Creates an access token for the specified user.
 *
 * This function generates a JSON Web Token (JWT) containing the user's details,
 * including their ID, admin status, first name, last name, and phone number.
 * The token is signed using a secret and is configured to expire in 15 minutes.
 *
 * @param user - An object representing the user for whom the access token is created.
 *               It must contain properties such as `user_id`, `is_admin`, `first_name`,
 *               `last_name`, and `phone_number`.
 * @returns A promise that resolves to a JWT access token string.
 */
export const createAccessToken = async (user: User) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            is_Admin: user.is_admin,
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            user_role: user.user_role
        },
        config.accessTokenSecret!,
        {
            expiresIn: '15m'
        }
    );
};
