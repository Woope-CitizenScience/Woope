import mime from "mime";
import * as SecureStore from 'expo-secure-store';
import { refreshAccessToken } from "../util/fetchWithToken";

// File upload API with token + refresh fallback
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
  },
  setUserToken?: (val: string | null) => void
) {
  const formData = new FormData();

  formData.append("name", data.name.slice(0, 20));
  formData.append("description", data.description);
  formData.append("date", typeof data.date === "string" ? data.date : data.date.toISOString().split("T")[0]);
  formData.append("tag", data.tag);
  formData.append("longitude", data.longitude.toString());
  formData.append("latitude", data.latitude.toString());

  if (data.images && data.images?.length) {
    data.images.forEach((imageUri, index) => {
      formData.append(`file`, {
        uri: imageUri,
        type: mime.getType(imageUri) || "image/jpeg",
        name: imageUri.split("/").pop() || `image${index}.jpg`,
      } as unknown as Blob);
    });
  }

  let token = await SecureStore.getItemAsync("accessToken");
  const config: RequestInit = {
    method,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: formData,
  };

  let response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, config);

  if (response.status === 401 && setUserToken) {
    console.warn("Token expired during file upload. Attempting refresh...");
    const newToken = await refreshAccessToken(setUserToken);
    if (newToken) {
      config.headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, config);
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Server error: ${response.status} - ${text}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  return await response.json();
}

// General-purpose API fetch with retry
export async function fetchAPI(
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  setUserToken?: (val: string | null) => void
) {
  let token = await SecureStore.getItemAsync("accessToken");

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, config);

  if (response.status === 401 && setUserToken) {
    console.warn("Token expired. Attempting refresh...");
    const newToken = await refreshAccessToken(setUserToken);
    if (newToken) {
      config.headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}${endpoint}`, config);
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const text = await response.text();
    try {
      const errorResponse = JSON.parse(text);
      throw new Error(errorResponse.error || response.statusText);
    } catch {
      throw new Error(text || "Unexpected error");
    }
  }

  if (response.status === 204) return;

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  return;
}
