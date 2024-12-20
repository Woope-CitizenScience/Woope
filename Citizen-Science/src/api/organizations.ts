import { fetchAPI } from "./fetch";

//retrieves all organizations 
export const getAllOrganizations = async () => {
    return fetchAPI(`/organizations/organizations`, 'GET');
}
//retrieves all organizations given a string parameter of the specific category
export const getOrganizationsWithCategory = async (category_name: string) => {
    return fetchAPI(`/organizations/organizationsbycategory/${category_name}`, 'GET');
}
//retrieves all organizations given a number parameter of the user id
export const getOrganizationsFollowed = async (user_id: number) => {
    return fetchAPI(`/organizations/organizationsbyfollowed/${user_id}`, 'GET');
}
//retrieves all categories 
export const getAllCategories = async() => {
    return fetchAPI('/organizations/category', 'GET');
}