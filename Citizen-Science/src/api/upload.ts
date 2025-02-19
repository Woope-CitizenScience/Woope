import axios from 'axios';
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