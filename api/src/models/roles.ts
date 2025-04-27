const pool = require('../db');

export const getRoles = async () => {
    try {
        const query = `SELECT * FROM roles`
        const response = await pool.query(query);
        return response.rows;
    }
    catch (e) {
        console.error('Error retrieving roles: ' + e);
    }
}

export const getPermissions = async () => {
    try {
        const query = `SELECT * FROM permissions`
        const response = await pool.query(query);
        return response.rows;
    }
    catch (e) {
        console.error('Error retrieving permissions: ' + e);
    }
}

export const getRolePermissions = async (roleId: number) => {
    try {
        const response = await pool.query(`SELECT * FROM role_permissions WHERE role_id=$1`, [roleId]);
        return response.rows;
    }
    catch (e) {
        console.error('Error retrieving permissions: ' + e);
    }
}

export const deleteRole = async (roleId: number) => {
    try {
        await pool.query(`DELETE FROM roles WHERE role_id=$1`, [roleId])
    }
    catch (e) {
        console.error('Error deleting role: ' + e)
    }
}

export const createRole = async (roleName: string) => {
    try {
        const response = await pool.query(`INSERT INTO roles (name) VALUES ($1) RETURNING *`, [roleName])
        return response.rows
    } catch (error) {
        console.error('Error creating role: ' + error)
    }
}

export const createRolePermission = async (roleId: number, permId: number) => {
    try {
        const response = await pool.query(`INSERT INTO role_permissions VALUES ($1, $2)`, [roleId, permId])
    } catch (error) {
        console.error('Error creating role permission: ' + error)
    }
}

export const deleteRolePermission = async (roleId: number, permId: number) => {
    try {
        const response = await pool.query(`DELETE FROM role_permissions WHERE role_id=$1 AND permission_id=$2`, [roleId, permId])
    } catch (error) {
        console.error('Error deleting role permission: ' + error)
    }
}