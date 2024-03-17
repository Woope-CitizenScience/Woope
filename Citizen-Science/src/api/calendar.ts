import {Event} from "../../../api/src/interfaces/Event";

export const createEvent = async (eventData: Event) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) {
        const errorResponse = await response.json();
        const error = new Error(errorResponse.error || response.statusText);
        error.name = `HTTP Error ${response.status}`;
        throw error;
    }

    return await response.json();
};


export const deleteEvent = async (eventId: number, userId: number) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        const error = new Error(errorResponse.error || response.statusText);
        error.name = `HTTP Error ${response.status}`;
        throw error;
    }

    return await response.json();
}


export const modifyEvent = async (eventId: number, userId: number, title: string, description: string, location: string, startTime: Date, endTime: Date) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_id: userId, title, description, location, startTime, endTime}),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        const error = new Error(errorResponse.error || response.statusText);
        error.name = `HTTP Error ${response.status}`;
        throw error;
    }

    return await response.json();
}

export const getEvent = async (eventId: number, userId: number) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/events/${eventId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_id: userId,}),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        const error = new Error(errorResponse.error || response.statusText);
        error.name = `HTTP Error ${response.status}`;
        throw error;
    }

    return await response.json();
}

