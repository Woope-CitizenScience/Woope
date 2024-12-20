export interface Organization{
    org_id: Number,
    name: String,
    text_description: String,
}

export interface OrganizationWithCategory{
    org_id: Number,
    name: String,
    category: String,
}

export interface category{
    category_id: Number,
    name: String,
}