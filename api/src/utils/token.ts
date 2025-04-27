import jwt from 'jsonwebtoken';
import {User} from '../interfaces/User';
import {config} from "../config/config";

export const createRefreshToken = async (user: User) => {
    return jwt.sign(
        {
            user_id: user.user_id,
        },
        config.refreshTokenSecret!,
        {
            expiresIn: `30d` //user will be logged out after a month
        }
    );
};

export const createAccessToken = async (user: User) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            permissions: typeof user.permissions === 'string'
            ? JSON.parse(user.permissions)
            : user.permissions,
            org_id: user.org_id,
            org_name: user.org_name
        },
        config.accessTokenSecret!,
        {
            expiresIn: '60m' //fetch request token will last an hour
        }
    );
};
