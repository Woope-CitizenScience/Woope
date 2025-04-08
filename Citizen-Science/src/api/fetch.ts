import mime from "mime";
import { PdfFile } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function fetchAPIWithFiles(
    endpoint: string,
    method: string = "POST",
    data: {
      name: string;
      description: string;
      date: Date | string;
      tag: string;
      longitude: number;
      latitude: number;
      images?: string[];
    }
  ) {
    const formData = new FormData();
  
    formData.append("name", data.name.slice(0, 20));
    formData.append("description", data.description);
    formData.append("date", typeof data.date === "string" ? data.date : data.date.toISOString().split("T")[0]);
    formData.append("tag", data.tag);
    formData.append("longitude", data.longitude.toString());
    formData.append("latitude", data.latitude.toString());
  
    if (data.images && data.images.length > 0) {
      data.images.forEach((imageUri, index) => {
        formData.append(`file`, {
          uri: imageUri,
          type: mime.getType(imageUri) || "image/jpeg",
          name: imageUri.split("/").pop() || `image${index}.jpg`,
        } as unknown as Blob);
      });
    }
  
    // FIX: Retrieve the token
    const token = await AsyncStorage.getItem("accessToken");

    console.log(" Token being sent:", token);

  
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, {
      method,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });
  
    if (!response.ok) {
      const text = await response.text();
      console.error("Unexpected server response:", text);
      throw new Error(`Server error: ${response.status} - ${text}`);
    }
  
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    }
  
    return await response.json();
  }
  

export async function fetchAPI(endpoint: string, method: string = 'GET', body: any = null) {
    const token = await AsyncStorage.getItem("accessToken"); // Store token in mobile storage
    
    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        }
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
