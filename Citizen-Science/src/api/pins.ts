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

// Old Pins

// export const getAllPins = async () => {
//     return fetchAPI(`/pins/`, 'GET');
// }

// export const getPinById = async (id: number) => {
//     return fetchAPI(`/pins/${id}`, 'GET');
// }

// export const updatePin = async (pin_id: number, user_id: number,
//     latitude: number, longitude: number, metadata?: string
// ) => {
//     return fetchAPI(`/pins/${pin_id}`, 'PUT', {
//         user_id, latitude, longitude, metadata
//     });
// }

// export const deletePin = async (id: number) => {
//     return fetchAPI(`/pins/${id}`, 'DELETE');
// }

////////////////////////////////////////////////
// New Pins 2024

export const createPin = async (name: string, description: string, date: Date, tag: string, longitude: number, latitude: number) => {
    return fetchAPI('/pins/pinnew', 'POST', {name, description, date, tag, longitude, latitude});
}

// Fetch all pins
export const getPins = async () => {
    //console.log("getAllPinsNew fetch api called)");
    return fetchAPI('/pins/pinnew', 'GET'); // Fetches data from the /pins/pinnew endpoint
};

export const deletePin = async (pinId: number) => {
    if (!pinId || isNaN(pinId)) {
        throw new Error(`Invalid pin ID: ${pinId}`);
    }
    return fetchAPI(`/pins/pinnew?pin_id=${pinId}`, 'DELETE');
};


export const updatePin = async (
    pinId: number,
    name: string,
    text_description: string,
    dateBegin: Date,
    label: string,
    longitude: number,
    latitude: number
) => {
    try {
        if (!pinId || isNaN(pinId)) {
            console.error(`Invalid pin ID: ${pinId}`);
            throw new Error(`Invalid pin ID: ${pinId}`);
        }

        // Log the parameters being sent
        console.log('Calling fetchAPI with:', {
            endpoint: `/pins/pinnew?pin_id=${pinId}`,
            method: 'UPDATE',
            body: {
                name,
                text_description,
                dateBegin,
                label,
                longitude,
                latitude,
            },
        });

        // Make the API call
        const response = await fetchAPI(
            `/pins/pinnew?pin_id=${pinId}`,
            'PUT',
            {
                name,
                text_description,
                dateBegin,
                label,
                longitude,
                latitude,
            }
        );

        // Log the response
        //console.log('Response from fetchAPI:', response);

        return response;
    } catch (error) {
        console.error('Error in updatePinNew:', error);
        throw error;
    }
};
