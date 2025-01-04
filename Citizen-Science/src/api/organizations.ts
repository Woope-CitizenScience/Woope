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
    return fetchAPI('/organizations/organizationsbyid/${org_id}', 'GET');
} 
//get all featured organizations
export const getFeaturedOrganizations = async() => {
    return fetchAPI('/organizations/featuredorganizations', 'GET');
}
// create an organization
export const createOrganization = async(name: string, tagline: string, text_description: string) =>{
    return fetchAPI('/organizations/create', 'POST', {name,tagline,text_description});
}