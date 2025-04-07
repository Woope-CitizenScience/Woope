import { fetchAPI } from "./fetch";

export const createReport = async (label: string, title: string, description: string) => {
    console.log('📡 Sending request to /report/create with:', { label, title, description });
    return fetchAPI('/report/create', 'POST', { label, title, description });
};
