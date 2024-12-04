import { Organization,OrganizationWithCategory } from "../interfaces/Organization";
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
            SELECT o.name, o.org_id, c.category_name
            FROM public.organizations o
            INNER JOIN public.organization_categories c ON o.org_id = c.org_id
            WHERE c.category_name = $1`;
        const orgs = await pool.query(query, [category]);
        return orgs.rows;
    }catch(error){
        throw new Error("Error retrieving " + category + " organizations: " + (error as Error).message)
    }
}
//get organizations followed by a user
export const getOrganizationsFollowed = async (user_id: number) : Promise<Organization[]> => {
    try {
       let query =`
            SELECT o.name, o.org_id, o.description
            FROM public.organizations o
            INNER JOIN public.organization_follows f ON o.org_id = f.org_id
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