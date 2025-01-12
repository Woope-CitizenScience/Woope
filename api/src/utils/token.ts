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
            expiresIn: `7d`
        }
    );
};

export const createAccessToken = async (user: User) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            // is_Admin: user.is_admin,
            firstName: user.first_name,
            lastName: user.last_name,
            phoneNumber: user.phone_number,
            permissions: user.permissions
        },
        config.accessTokenSecret!,
        {
            expiresIn: '15m'
        }
    );
};
