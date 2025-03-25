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

export interface DecodedUserPayload {
    user_id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    permissions: Record<string, boolean>;
    org_id: number | null;
    org_name: string | null;
  }


  