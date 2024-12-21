import { fetchAPI } from "./fetch";

export const createPost = async (pin_id: number, user_id: number,
    latitude: number, longitude: number, metadata?: string
) => {
    console.log(
        'Pin-ID', pin_id, 'User-ID', user_id, 'Latitude',
        latitude, 'Longitude', longitude, 'metadata', metadata);
    return fetchAPI('/pins', 'POST', {
        pin_id, user_id, latitude, longitude, metadata
     });
}  

export const getAllPins = async () => {
    return fetchAPI(`/pins/`, 'GET');
}

export const getPinById = async (id: number) => {
    return fetchAPI(`/pins/${id}`, 'GET');
}

export const updatePin = async (pin_id: number, user_id: number,
    latitude: number, longitude: number, metadata?: string
) => {
    return fetchAPI(`/pins/${pin_id}`, 'PUT', {
        user_id, latitude, longitude, metadata
    });
}

export const deletePin = async (id: number) => {
    return fetchAPI(`/pins/${id}`, 'DELETE');
}

////////////////////////////////////////////////
// New Pins 2024

export const createPinNew = async (name: string, description: string, date: Date, tag: string, longitude: number, latitude: number) => {
    return fetchAPI('/pins/pinnew', 'POST', {name, description, date, tag, longitude, latitude});
}

// Fetch all pins
export const getAllPinsNew = async () => {
    console.log("getAllPinsNew fetch api called)");
    return fetchAPI('/pins/pinnew', 'GET'); // Fetches data from the /pins/pinnew endpoint
};