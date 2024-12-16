export interface Pin {
    post_id: number,
    user_id: number,
    longitude: number,
    latitude: number,
    metadata: string,
    created_at: Date,
    is_active: boolean,
}
export interface PinNew {
    pin_id: number,
    name: string,
    description: string,
    date: Date,
    tag: string,
    longitude: number,
    latitude: number,
}
