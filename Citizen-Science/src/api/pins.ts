import { fetchAPI, fetchAPIWithFiles } from "./fetch";

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


export const createPin = async (name: string, description: string, dateBegin: Date, tag: string, longitude: number, latitude: number) => {
    return fetchAPI('/pins/pinnew', 'POST', {name, description, dateBegin, tag, longitude, latitude});
}

// Fetch all pins
export const getPins = async () => {
    //console.log("getAllPinsNew fetch api called)");
    return fetchAPI('/pins/pinnew', 'GET'); // Fetches data from the /pins/pinnew endpoint
};


export const createPinNew = async (
    name: string,
    description: string,
    date: Date,
    tag: string,
    longitude: number,
    latitude: number,
    imageUri?: string | null // Image is optional
) => {
    const data = {
        name, // ✅ Use "name" instead of "text"
        description, // ✅ Ensure description is passed
        date: date.toISOString().split("T")[0], // ✅ Ensure date is properly formatted
        tag,
        longitude,
        latitude,
        images: imageUri ? [imageUri] : [] // ✅ Ensure images are passed as an array
    };

    return fetchAPIWithFiles('/pins/pinnew', 'POST', data);
};

// Fetch all pins
export const getAllPinsNew = async () => {
    console.log("Fetching all pins...");
    const response = await fetchAPI('/pins/pinnew', 'GET');
    console.log("Fetched Pins Data:", response);
    return response;
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
