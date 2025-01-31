import { fetchAPI } from "./fetch";

export const getRoles = async() => {
    return fetchAPI('/roles/roles');
}