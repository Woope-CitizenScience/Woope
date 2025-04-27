import { fetchAPI } from "./fetch";

// Fetch all pins
export const getPins = async () => {
    return fetchAPI("/pins/pinnew");
};

// Search pins by name, label, or description
export const searchPins = async (query: string) => {
    return fetchAPI(`/pins/pinnew?search=${query}`);
};


// Create a new pin
export const createPin = async (pinData: {
    name: string;
    text_description: string;
    dateBegin: Date;
    label: string;
    longitude: number;
    latitude: number;
}) => {
    return fetchAPI("/pins/pinnew", "POST", pinData);
};

// Update an existing pin
export const updatePin = async (pin_id: number, pinData: {
    name: string;
    text_description: string;
    dateBegin: Date;
    label: string;
    longitude: number;
    latitude: number;
}) => {
    return fetchAPI(`/pins/pinnew?pin_id=${pin_id}`, "PUT", pinData);
};

// Delete a pin
export const deletePin = async (pin_id: number) => {
    return fetchAPI(`/pins/pinnew?pin_id=${pin_id}`, "DELETE");
};
