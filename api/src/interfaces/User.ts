export interface User {
    user_id: number;
    email: string;
    role_id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    password_hash?: string;
    refresh_token?: string;
    permissions?: string;
    org_id: number;
    org_name: string;
}



  