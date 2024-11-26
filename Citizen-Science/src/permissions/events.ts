import {AccessToken} from "../util/token";

export const userCanCreateEvent = (user: AccessToken | null) => {
    if(user === null){return false};
    return(
        user.user_role === 'Admin'
    );
}