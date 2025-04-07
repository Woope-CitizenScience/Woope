import { fetchAPI } from "./fetch";

// create an resource
export const createResource = async(org_id: number, name: string, tagline: string, text_description: string) =>{
    return fetchAPI('/resources/create', 'POST', {org_id, name,tagline,text_description});
}
//get all resources
export const getResources = async() => {
    return fetchAPI('/resources/get', 'GET');
}
//get all resources belonging to a specific organization
export const getResourceById = async(org_id: number) => {
    return fetchAPI(`/resources/getresourcesbyid/${org_id}`, 'GET');
} 
//get the info of a resource when given its id
export const getResourceInfo = async(resource_id: number) => {
    return fetchAPI(`/resources/getresourceinfo/${resource_id}`, 'GET');
} 
//update resource
export const updateResource = async(resource_id: number, tagline: string, text_description: string) => {
    return fetchAPI(`/resources/update`, 'PUT', {resource_id,tagline,text_description});
}
//delete resource
export const deleteResource = async (resource_id: number, name: string) => {
    return fetchAPI(`/resources/delete`, 'DELETE', {resource_id, name});
}
//get all resource media belonging to a specific resource parent
export const getResourceMedia = async(resource_id: number) => {
    return fetchAPI(`/resources/getresourcesmedia/${resource_id}`, 'GET');
}
//insert resource media/children under a parent resource
export const insertResourceMedia = async(resource_id: number, name: string, file_path: string) => {
    return fetchAPI(`/resources/insertMedia`, 'POST', {resource_id, name, file_path});
}
//delete resource media
export const deleteResourceMedia = async (media_id: number) => {
    return fetchAPI(`/resources/deleteMedia`, 'DELETE', {media_id});
}
//update photo filename
export const updateResourcePhoto = async (resource_id: number, image_path: string) => {
    return fetchAPI(`/resources/updatephoto`, 'PUT', {resource_id, image_path});
}