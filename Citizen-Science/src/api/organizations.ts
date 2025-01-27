import { fetchAPI } from "./fetch";

//retrieves all organizations 
export const getAllOrganizations = async () => {
    return fetchAPI(`/organizations/organizations`, 'GET');
}
//retrieves all organizations given a string parameter of the specific category
export const getOrganizationsWithCategory = async (category_name: string) => {
    return fetchAPI(`/organizations/organizationsbycategory/${category_name}`, 'GET');
}
//retrieves all organizations given a category id
export const getOrganizationsByCategoryId = async(category_id: number) => {
    return fetchAPI(`/organizations/organizationsbycategoryid/${category_id}`, 'GET');
}
//retrieves all organizations given a number parameter of the user id
export const getOrganizationsFollowed = async (user_id: number) => {
    return fetchAPI(`/organizations/organizationsbyfollowed/${user_id}`, 'GET');
}
//retrieves all categories 
export const getAllCategories = async() => {
    return fetchAPI('/organizations/category', 'GET');
}
//get the info of an organization given its organization id
export const getOrganizationById = async(org_id: number) => {
    return fetchAPI(`/organizations/organizationsbyid/${org_id}`, 'GET');
} 
//get the info of an organization given its name
export const getOrganizationByName = async(name: string) => {
    return fetchAPI(`/organizations/organizationsbyname/${name}`, 'GET');
} 
//get all featured organizations
export const getFeaturedOrganizations = async() => {
    return fetchAPI(`/organizations/featuredorganizations`, 'GET');
}
// create an organization
export const createOrganization = async(name: string, tagline: string, text_description: string) => {
    return fetchAPI(`/organizations/create`, 'POST', {name,tagline,text_description});
}
//follow an organization
export const followOrganization = async(user_id: number, org_id: number) => {
    return fetchAPI(`/organizations/follow`, 'POST', {user_id, org_id});
}
//update an organization
export const updateOrganization = async(name: string, tagline: string, text_description: string) => {
    return fetchAPI(`/organizations/update`, 'PUT', {name,tagline,text_description});
}
//feature an organization given its name
export const setFeatured = async(name: string) => {
    return fetchAPI(`/organizations/setfeatured`, 'PUT', {name});
}
//remove the feature of an organization given its org id
export const removeFeature = async(name: string) => {
    return fetchAPI(`/organizations/removefeatured`, 'PUT', {name});
}
//check if followed
export const checkFollowed = async(user_id: number, org_id: number) =>{
    return fetchAPI(`/organizations/checkfollow`, 'PUT', {user_id,org_id});
}
//unfollow an organization
export const unfollow = async (user_id: number, org_id: number) => {
    return fetchAPI(`/organizations/unfollow`, 'DELETE', {user_id, org_id});
}
//delete an organization
export const deleteOrganization = async (name: string) => {
    return fetchAPI(`/organizations/deleteorganization`, 'DELETE', {name});
}