import { Organization, OrganizationWithCategory, Category } from "../interfaces/Organization";
const pool = require('../db');

/**
 * Retrieves all organizations from the database.
 * @returns {Promise<Organization[]>} A list of all organizations.
 * @throws {Error} Throws an error if the database query fails.
 */

export const getOrganizations = async (): Promise<Organization[]> => {
    try {
        let query = "SELECT * FROM public.organizations ORDER BY org_id ASC";
        const orgs = await pool.query(query);
        return orgs.rows;
    } catch (error) {
        throw new Error("Error retrieving organizations: " + (error as Error).message);
    }
}

/**
 * Retrieves organizations by a specific category.
 * @param {string} category - The category name.
 * @returns {Promise<OrganizationWithCategory[]>} A list of organizations under the specified category.
 * @throws {Error} Throws an error if the query fails.
 */

export const getOrganizationsWithCategory = async (category: string): Promise<OrganizationWithCategory[]> => {
    try {
        let query = `
            SELECT o.name, o.org_id, g.name
            FROM public.organizations o
            INNER JOIN public.organizations_category c ON o.org_id = c.org_id
            INNER JOIN category g ON g.category_id = c.category_id
            WHERE g.name = $1`;
        const orgs = await pool.query(query, [category]);
        return orgs.rows;
    } catch (error) {
        throw new Error("Error retrieving " + category + " organizations: " + (error as Error).message)
    }
}

/**
 * Retrieves organizations by a specific category ID.
 * @param {number} category_id - The category ID.
 * @returns {Promise<Organization[]>} A list of organizations within the specified category.
 * @throws {Error} Throws an error if the query fails.
 */

export const getOrganizationsWithCategoryId = async (category_id: number): Promise<Organization[]> => {
    try {
        let query = `
            SELECT o.name, o.org_id, o.tagline, o.text_description
            FROM public.organizations o
            INNER JOIN public.organizations_category c ON o.org_id = c.org_id
            WHERE c.category_id = $1
        `
        const orgs = await pool.query(query, [category_id]);
        return orgs.rows;

    } catch (error) {
        throw new Error("Error retrieving selected categories organizations: " + (error as Error).message)
    }
}

/**
 * Retrieves organizations followed by a specific user.
 * @param {number} user_id - The user ID.
 * @returns {Promise<Organization[]>} A list of followed organizations.
 * @throws {Error} Throws an error if the query fails.
 */

export const getOrganizationsFollowed = async (user_id: number): Promise<Organization[]> => {
    try {
        let query = `
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


/**
 * Allows a user to follow an organization.
 * @param {number} user_id - The user ID.
 * @param {number} org_id - The organization ID.
 * @returns {Promise<object[]>} The newly created follow record.
 * @throws {Error} Throws an error if the query fails.
 */

export const followOrganization = async (user_id: number, org_id: number) => {
    try {
        let query = `
            INSERT INTO public.user_organization_follows (user_id, org_id) VALUES ($1, $2) RETURNING *
        `;
        let values = [user_id, org_id];
        const result = pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error("Error following organization " + (error as Error).message);
    }
}

/**
 * Retrieves an organization by its ID.
 * @param {number} org_id - The organization ID.
 * @returns {Promise<Organization[]>} The organization details.
 * @throws {Error} Throws an error if the query fails.
 */

export const getOrganizationById = async (org_id: number): Promise<Organization> => {
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



export const getOrganizationByName = async (name: string): Promise<Organization[]> => {
    try {
        let query = `
            SELECT *
            FROM public.organizations o
            WHERE o.name = $1`;
        const org = await pool.query(query, [name]);
        return org.rows;
    } catch (error) {
        throw new Error("Error retrieving organization: " + (error as Error).message);
    }
}

/**
 * Retrieves featured organizations.
 * @returns {Promise<Organization[]>} A list of featured organizations.
 * @throws {Error} Throws an error if the query fails.
 */

export const getFeaturedOrganizations = async (): Promise<Organization[]> => {
    try {
        let query = `
            SELECT *
            FROM public.organizations o
            WHERE o.is_featured = true`;
        const org = await pool.query(query);
        return org.rows;
    } catch (error) {
        throw new Error("Error retrieving organization: " + (error as Error).message);
    }
}

/**
 * Marks an organization as featured.
 * @param {string} name - The organization name.
 * @returns {Promise<object[]>} The updated organization record.
 * @throws {Error} Throws an error if the update fails.
 */

export const featureOrganization = async (name: string) => {
    try {
        let query = `
            UPDATE public.organizations 
            SET is_Featured = true 
            WHERE name = $1;
            `
        let values = [name];
        const org = await pool.query(query, values);
        return org.rows;
    } catch (error) {
        throw new Error("Error featuring organization: " + (error as Error).message);
    }
}

/**
 * Unmarks an organization as featured.
 * @param {string} name - The organization name.
 * @returns {Promise<object[]>} The updated organization record.
 * @throws {Error} Throws an error if the update fails.
 */

export const removeFeature = async (name: string) => {
    try {
        let query = `
            UPDATE public.organizations 
            SET is_Featured = false 
            WHERE name = $1;
            `
        let values = [name];
        const org = await pool.query(query, values);
        return org.rows;
    } catch (error) {
        throw new Error("Error unfeaturing organization: " + (error as Error).message);

    }
}
//gets all organization categories
export const getCategory = async (): Promise<Category[]> => {
    try {
        let query = `
            SELECT *
            FROM public.category`;
        const category = await pool.query(query);
        return category.rows;
    }
    catch (error) {
        throw new Error("Error retrieving categories: " + (error as Error).message);
    }
}

/**
 * Creates a new organization.
 * @param {string} name - The organization name.
 * @param {string} tagline - The organization's tagline.
 * @param {string} text_description - The organization's description.
 * @returns {Promise<object[]>} The newly created organization.
 * @throws {Error} Throws an error if the creation fails.
 */

export const createOrganization = async (name: string, tagline: string, text_description: string) => {
    if (!name) {
        throw new Error("A valid name is required");
    }
    try {
        let query;
        let values;
        if (tagline && text_description) {
            query = `
                INSERT INTO public.organizations (name, tagline, text_description) VALUES ($1,$2,$3) RETURNING *
            `;
            values = [name, tagline, text_description];
        }
        else if (tagline && !text_description) {
            query = `
                INSERT INTO public.organizations (name, tagline) VALUES ($1, $2) RETURNING *
            `;
            values = [name, tagline];
        }
        else if (text_description && !tagline) {
            query = `
                INSERT INTO public.organizations (name, text_description) VALUES ($1,$2) RETURNING *
            `;
            values = [name, text_description];
        }
        else {
            query = `
                INSERT INTO public.organizations (name) VALUES ($1) RETURNING *
            `;
            values = [name];
        }
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch (error) {
        throw new Error("Error creating organizaton: " + (error as Error).message);
    }
}

/**
 * Updates the details of an organization.
 * @param {string} name - The name of the organization to update.
 * @param {string} tagline - The new tagline.
 * @param {string} text_description - The new text description.
 * @returns {Promise<Organization[]>} The updated organization.
 * @throws {Error} Throws an error if the database query fails.
 */

export const updateOrganization = async (name: string, tagline: string, text_description: string) => {
    try {
        let query;
        let values;
        if (tagline && text_description) {
            query = `
                UPDATE public.organizations SET tagline = $1, text_description = $2 WHERE name = $3 RETURNING *
            `;
            values = [tagline, text_description, name];
        }
        else if (tagline && !text_description) {
            query = `
                UPDATE public.organizations SET tagline = $1 WHERE name = $2 RETURNING *
            `;
            values = [tagline, name];
        }
        else if (text_description && !tagline) {
            query = `
                UPDATE public.organizations SET text_description = $1 WHERE name = $2 RETURNING *
            `;
            values = [text_description, name];
        }
        else {
            throw new Error("No fields entered, no changes were made")
        }
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch (error) {
        throw new Error("Error creating organizaton: " + (error as Error).message);
    }
}

/**
 * Updates the photo of an organization.
 * @param {string} name - The name of the organization.
 * @param {string} image_path - The path to the new image.
 * @returns {Promise<Organization[]>} The updated organization.
 * @throws {Error} Throws an error if the database query fails.
 */

export const updatePhoto = async (org_id: number, image_path: string) => {
    try {
        let query = `
                UPDATE public.organizations SET image_path = $1 WHERE org_id = $2 RETURNING *
            `;
        let values = [image_path, org_id];
        const response = await pool.query(query, values);
        return response.rows;
    }
    catch (error) {
        throw new Error("Error updating photo: " + (error as Error).message);
    }
}

/**
 * Checks if a user follows an organization.
 * 
 * @param user_id The id of the user
 * @param org_id The id of the organization
 * @returns `true` or `false` if the user follows the organization
 */
export const isFollowed = async (user_id: number, org_id: number) => {
    try {
        let query = `
            SELECT CASE WHEN EXISTS (
                SELECT *
                FROM user_organization_follows
                WHERE user_id = $1 AND org_id = $2
            )
            THEN CAST(1 AS BIT)
            ELSE CAST(0 AS BIT) 
            END`
        let values = [user_id, org_id]
        const response = await pool.query(query, values)
        return response.rows[0];
    } catch (error) {
        throw new Error("Error checking following status: " + (error as Error).message)
    }
}

/**
 * Remove a follow when given user id and group id 
 * 
 * @param user_id ID of the user
 * @param org_id  ID of the organization
 */

export const unfollow = async (user_id: number, org_id: string) => {
    try {
        let query = `
            DELETE FROM public.user_organization_follows WHERE user_id = $1 AND org_id = $2
            `;
        let values = [user_id, org_id];
        await pool.query(query, values);

    } catch (error) {
        throw new Error("Error deleting resource: " + (error as Error).message);
    }
}

/**
 * Deletes an organization by name.
 * @param {string} name - The organization name.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */

export const deleteOrganization = async (name: string) => {
    try {
        let query = `
            DELETE FROM public.organizations WHERE name = $1
        `
        let values = [name];
        await pool.query(query, values);
    } catch (error) {
        throw new Error("Error deleting organization: " + (error as Error).message);
    }
}
