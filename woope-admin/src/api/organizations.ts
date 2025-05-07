import { fetchAPI } from "./fetch";

export const getOrganizationById = async (userId: string) => {
    return fetchAPI(`/organizations/organizationsbyid/${userId}`)
}

export const getOrganizations = async () => {
    return fetchAPI(`/organizations/organizations`)
}

export const createOrganization = async (name: string, tagline: string, text_description: string) => {
    return fetchAPI(`/organizations/create`, 'POST', { name, tagline, text_description });
}

export const deleteOrganization = async (name: string) => {
    return fetchAPI(`/organizations/deleteorganization`, 'DELETE', { name });
}

//feature an organization given its name
export const setFeatured = async(name: string) => {
    return fetchAPI(`/organizations/setfeatured`, 'PUT', {name});
}
//remove the feature of an organization given its org id
export const removeFeature = async(name: string) => {
    return fetchAPI(`/organizations/removefeatured`, 'PUT', {name});
}