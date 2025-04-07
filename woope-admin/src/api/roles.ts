import { fetchAPI } from "./fetch";

export const getRoles = async () => {
    return fetchAPI('/roles/roles');
}

export const getPermissions = async () => {
    return fetchAPI(`/roles/permissions`)
}

export const getRolePermissions = async (role_id: number) => {
    return fetchAPI(`/roles/role-permissions/${role_id}`)
}

export const deleteRole = async (role_id: number) => {
    return fetchAPI(`/roles/delete/${role_id}`, "DELETE");
};

export const createRole = async (role_name: string) => {
    return fetchAPI(`/roles/create/${role_name}`)
}

export const createRolePermission = async (role_id: number, permission_id: number) => {
    return fetchAPI(`/roles/create-role-permission`, "POST", { role_id, permission_id })
}

export const deleteRolePermission = async (role_id: number, permission_id: number) => {
    return fetchAPI(`/roles/delete-role-permission`, "DELETE", { role_id, permission_id })
}