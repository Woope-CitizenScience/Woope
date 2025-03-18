import jwt from 'jsonwebtoken';
import { User } from '../interfaces/User';
import { config } from "../config/config";

/**
 * Generates a refresh token for a user.
 *
 * @param user - The user object containing user details.
 * @returns A promise that resolves to the generated refresh token as a string.
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
 * Generates an access token for a user.
 *
 * @param user - The user object containing user details.
 * @returns A promise that resolves to the generated access token as a string.
 */

export const createAccessToken = async (user: User) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            permissions: user.permissions,
            org_id: user.org_id,
            org_name: user.org_name
        },
        config.accessTokenSecret!,
        {
            expiresIn: '15m'
        }
    );
};
