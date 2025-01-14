export async function fetchAPI(endpoint: string, method: string = 'GET', body: any = null) {
    const config: RequestInit = { 
        method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);

    if (!response.ok) {
        const textResponse = await response.text();
        try {
            console.log("Non-JSON response received:", textResponse);
            const errorResponse = JSON.parse(textResponse);
            throw new Error(errorResponse.error || response.statusText);
        } catch (error) {
            throw new Error('The server returned an unexpected response.');
        }
    }

    return await response.json();
}