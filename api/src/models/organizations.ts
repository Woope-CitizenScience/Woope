import { Organization,OrganizationWithCategory,Category} from "../interfaces/Organization";
const pool = require('../db');
//get all organizations
export const getOrganizations = async () : Promise<Organization[]>=> {
    try {
       let query = "SELECT * FROM public.organizations ORDER BY org_id ASC";
        const  orgs  = await pool.query(query);
        return orgs.rows;
    } catch (error) {
        throw new Error("Error retrieving organizations: " + (error as Error).message);
    }
}
//get organizations by specific category
export const getOrganizationsWithCategory = async (category: string) : Promise<OrganizationWithCategory[]> =>{
    try{
        let query = `
            SELECT o.name, o.org_id, g.name
            FROM public.organizations o
            INNER JOIN public.organizations_category c ON o.org_id = c.org_id
            INNER JOIN category g ON g.category_id = c.category_id
            WHERE g.name = $1`;
        const orgs = await pool.query(query, [category]);
        return orgs.rows;
    }catch(error){
        throw new Error("Error retrieving " + category + " organizations: " + (error as Error).message)
    }
}
// get organizations by specific category id
export const getOrganizationsWithCategoryId = async (category_id: number) : Promise <Organization[]> => {
    try{ 
        let query = `
            SELECT o.name, o.org_id, o.tagline, o.text_description
            FROM public.organizations o
            INNER JOIN public.organizations_category c ON o.org_id = c.org_id
            WHERE c.category_id = $1
        `
        const orgs = await pool.query(query, [category_id]);
        return orgs.rows;

    }catch(error){
        throw new Error("Error retrieving selected categories organizations: " + (error as Error).message)
    }
}
//get organizations followed by a user
export const getOrganizationsFollowed = async (user_id: number) : Promise<Organization[]> => {
    try {
        let query =`
            SELECT o.name, o.org_id, o.text_description
            FROM public.organizations o
            INNER JOIN public.user_organization_follows f ON o.org_id = f.org_id
            INNER JOIN public.users u ON u.user_id = f.user_id
            Where u.user_id = $1`;
        const orgs = await pool.query(query, [user_id]);
        return orgs.rows;
    } catch (error) {
        throw new Error("Error retrieving organizations: " + (error as Error).message);
    }
}
//get an organization given an organization id
export const getOrganizationById = async (org_id: number) : Promise<Organization[]> => {
    try {
        let query = `
            SELECT * 
            FROM public.organizations o
            WHERE o.org_id = $1`;
        const org = await pool.query(query, [org_id]);
        return org.rows;
    } catch (error) {
        throw new Error("Error retrieving organization: " + (error as Error).message);
    }
}
//get featured organizations
export const getFeaturedOrganizations = async (): Promise<Organization[]> => {
    try{
        let query = `
            SELECT *
            FROM public.organizations o
            WHERE o.is_featured = true`;
        const org = await pool.query(query);
        return org.rows;
    }catch(error){
        throw new Error("Error retrieving organization: " + (error as Error).message);
    }
}
//gets all organization categories
export const getCategory = async() : Promise<Category[]> => {
    try{
        let query =`
            SELECT *
            FROM public.category`;
        const category = await pool.query(query);
        return category.rows;
    }
    catch (error) {
        throw new Error("Error retrieving categories: " + (error as Error).message);
    }
}
//create an organization
export const createOrganization = async(name: string, tagline: string, text_description: string) => {
    if(!name){
        throw new Error("A valid name is required");
    }
    try{
        let query;
        let values;
        if(tagline && text_description){
            query = `
                INSERT INTO public.organizations (name, tagline, text_description) VALUES ($1,$2,$3) RETURNING *
            `; 
            values = [name, tagline, text_description];
        }
        else if(tagline && !text_description){
            query = `
                INSERT INTO public.organizations (name, tagline) VALUES ($1, $2) RETURNING *
            `;
            values = [name, tagline];
        }
        else if(text_description && !tagline){
            query = `
                INSERT INTO public.organizations (name, text_description) VALUES ($1,$2) RETURNING *
            `;
            values = [name, text_description];
        }
        else{
            query = `
                INSERT INTO public.organizations (name) VALUES ($1) RETURNING *
            `;
            values = [name];
        }
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch(error){
        throw new Error("Error creating organizaton: " + (error as Error).message);
    }
}