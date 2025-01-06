import { fetchAPI } from "./fetch";

export const searchUser = async(name: string) => {
    return fetchAPI(`/community/search-profile/${name}`)
}
