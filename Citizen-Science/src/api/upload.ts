import axios from 'axios';
import { fetchAPI } from "./fetch";
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

export function submitForm(contentType, data, setResponse) {
    axios({
    url: `${API_BASE}/upload`,
    method: 'POST',
    data: data,
    headers: {
    'Content-Type': contentType
    }
    }).then((response) => {
    setResponse(response.data);
    }).catch((error) => {
    setResponse("error");
    })
}

//deletes file from server side given its name/path
export const serverDelete = async (path: string) => {
    return fetchAPI(`/resources/serverDelete`, 'DELETE', {path});
}
