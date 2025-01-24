import { fetchAPI } from "./fetch";

export const searchUser = async (name: string) => {
    return fetchAPI(`/community/search-profile/${name}`)
}

export const getUserByID = async (userId: string) => {
    return fetchAPI(`/community/get-user-info/${userId}`)
}
