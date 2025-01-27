import { fetchAPI } from "./fetch";

export const getOrganizationById = async (userId: string) => {
    return fetchAPI(`/organizations/organizationsbyid/${userId}`)
}

export const getOrganizations = async() => {
    return fetchAPI(`/organizations/organizations`)
}