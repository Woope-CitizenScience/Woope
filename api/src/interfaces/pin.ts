export interface Pin {
    post_id: number,
    user_id: number,
    longitude: number,
    latitude: number,
    metadata: string,
    created_at: Date,
    imageUrl: String,
    is_active: boolean,
}
export interface PinNew {
    user_id: number | undefined;
    pin_id: number,
    name: string,
    text_description: string,
    dateBegin: Date,
    label: string,
    longitude: number,
    latitude: number,
    imageUrl: String,
}
