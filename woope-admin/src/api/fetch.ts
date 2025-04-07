export async function fetchAPI(endpoint: string, method: string = 'GET', body: any = null) {
    const token = localStorage.getItem("token"); // Get token from local storage

    const config: RequestInit = { 
        method,
        headers: { 
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "" // Attach token
        }
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config);

    if (!response.ok) {
        const textResponse = await response.text();
        try {
            const errorResponse = JSON.parse(textResponse);
            throw new Error(errorResponse.error || response.statusText);
        } catch (error) {
            throw new Error('The server returned an unexpected response.');
        }
    }

    return await response.json();
}
