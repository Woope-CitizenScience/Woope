import mime from "mime";
import { PdfFile } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function fetchAPIWithFiles(endpoint: string, method: string = 'POST', data: { text: string, images: string[], pdfs: PdfFile[] }) {
    const formData = new FormData();
    formData.append('text', data.text);
    
    data.images.forEach((imageUri, index) => {
        formData.append(`image${index}`, {
            uri : imageUri,
            type: mime.getType(imageUri),
            name: imageUri.split("/").pop()
        } as unknown as Blob);
    });
    
    data.pdfs.forEach((pdf, index) => {
        formData.append(`pdf${index}`, { 
            uri: pdf.uri, 
            name: pdf.name, 
            type: 'application/pdf' 
        } as unknown as Blob);
    });

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
        method,
        body: formData,
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || response.statusText);
    }

    return await response.json();
}

export async function fetchAPI(endpoint: string, method: string = 'GET', body: any = null) {
    const token = await AsyncStorage.getItem("accessToken"); // Store token in mobile storage


    const config: RequestInit = { 
        method,
        headers: { 'Content-Type': 'application/json',
                "Authorization": token ? `Bearer ${token}` : "" // Attach token

         }
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
