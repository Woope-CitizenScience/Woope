import { fetchAPI } from "./fetch";

export const logActivity = async (user_id: Number, description: String) => {
    return fetchAPI(`/activity/log-activity`, 'POST', {user_id, description});
};