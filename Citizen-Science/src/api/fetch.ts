import mime from "mime";
import { PdfFile } from "./types";

export async function fetchAPIWithFiles(
    endpoint: string,
    method: string = "POST",
    data: { name: string; description: string; date: Date | string; tag: string; longitude: number; latitude: number; images?: string[]; }
) {
    const formData = new FormData();

    formData.append("name", data.name.slice(0, 20)); // ✅ Ensure "name" is sent
    formData.append("description", data.description);
    formData.append("date", typeof data.date === "string" ? data.date : data.date.toISOString().split("T")[0]); // ✅ Ensure the correct field name
    formData.append("tag", data.tag);
    formData.append("longitude", data.longitude.toString());
    formData.append("latitude", data.latitude.toString());

    // Handle image uploads
    if (data.images && data.images.length > 0) {
        data.images.forEach((imageUri, index) => {
            formData.append(`file`, {
                uri: imageUri,
                type: mime.getType(imageUri) || "image/jpeg", // Default to JPEG if type is unknown
                name: imageUri.split("/").pop() || `image${index}.jpg`,
            } as unknown as Blob);
        });
    }

    // ✅ Debugging: Log FormData values before sending
    console.log("📤 Sending Form Data to Backend...");
    formData.forEach((value, key) => {
        console.log("📝", key, value); // ✅ Log key-value pairs correctly
    });


    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
        method,
        body: formData,
    });

    if (!response.ok) {
        // Handle non-JSON responses (e.g., HTML error page)
        const text = await response.text();
        console.error("Unexpected server response:", text);
        throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const contentType = response.headers.get("content-type");

    // Ensure we only parse JSON if it's actually JSON
    if (contentType?.includes("application/json")) {
        return await response.json();
    }

    return await response.json();
}

export async function fetchAPI(endpoint: string, method: string = 'GET', body: any = null) {
    const config: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, config);

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
