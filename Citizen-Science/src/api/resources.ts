import { fetchAPI } from "./fetch";

// create an resource
export const createResource = async(name: string, tagline: string, text_description: string) =>{
    return fetchAPI('/resources/create', 'POST', {name,tagline,text_description});
}
//get all resources
export const getResources = async() => {
    return fetchAPI('/resources/get', 'GET');
}