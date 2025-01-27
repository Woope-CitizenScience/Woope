import { fetchAPI } from "./fetch";

export const searchUser = async (name: string) => {
    return fetchAPI(`/community/search-profile/${name}`)
}

export const getUserByID = async (userId: string) => {
    return fetchAPI(`/community/get-user-info/${userId}`)
}

export const updateUserOrg = async (user_id: string, org_id: string | null) => {
    return fetchAPI(`/community/update-org`,'POST',{user_id, org_id})
}

export const updateUserRole = async (user_id: string, role_id: string) => {
    return fetchAPI('/community/update-role', 'POST', {user_id, role_id})
}
