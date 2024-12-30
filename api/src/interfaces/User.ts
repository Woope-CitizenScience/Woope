export interface User {
    user_id: number;
    email: string;
    is_admin: boolean;
    first_name: string;
    last_name: string;
    phone_number: string;
    password_hash?: string;
    refresh_token?: string;
    permissions?: string;
}



  