export interface Organization{
    org_id: number,
    name: string,
    text_description: string,
    tagline: string,
}
export interface OrganizationInfo{
    name: string,
    text_description: string,
    tagline: string,
}
export interface OrganizationWithCategory{
    org_id: number,
    name: string,
    category: string,
}
export interface OrganizationFollowed{
    user_id: number, 
    org_id: number,
}
export interface Category{
    category_id: number,
    name: string,
}