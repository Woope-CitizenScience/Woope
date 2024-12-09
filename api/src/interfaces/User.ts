/**
 * Represents a user in the application with essential profile and authentication details.
 * 
 * @interface User
 * 
 * @property {number} user_id - The unique identifier for the user.
 * @property {string} email - The user's email address.
 * @property {boolean} is_admin - Flag indicating if the user has administrative privileges.
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 * @property {string} phone_number - The user's contact phone number.
 * @property {string} [password_hash] - The hashed password for user authentication (optional).
 * @property {string} [refresh_token] - The token used to refresh the user's authentication session (optional).
 * @property {string} user_role - The user's role that determines their access level.
 */
export interface User {
    user_id: number;
    email: string;
    is_admin: boolean;
    first_name: string;
    last_name: string;
    phone_number: string;
    password_hash?: string;
    refresh_token?: string;
    user_role: string;
    admins_org: number;
}