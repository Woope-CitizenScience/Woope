export interface Pin {
    post_id: number,
    user_id: number,
    longitude: number,
    latitude: number,
    metadata: string,
    created_at: Date,
    is_active: boolean,
}