import { fetchAPI } from "./fetch";

//get all events given an org id
export const getEvents = async(org_id: number) => {
    return fetchAPI(`/events/getall/${org_id}`, 'GET');
}
//create an event
export const createEvents = async(org_id:number, name: string, tagline: string, text_description: string, time_begin: Date, time_end: Date) => {
    return fetchAPI(`/events/create`, 'POST', {org_id, name, tagline, text_description, time_begin, time_end});
}
//get the info of an event when given its id
export const getEventInfo = async(event_id: number) => {
    return fetchAPI(`/events/geteventinfo/${event_id}`, 'GET');
} 
//delete resource
export const deleteEvent = async (event_id: number, name: string) => {
    return fetchAPI(`/events/delete`, 'DELETE', {event_id, name});
}
//update event
export const updateEvent = async(event_id: number, tagline: string, text_description: string, time_begin: Date, time_end: Date) => {
    return fetchAPI(`/events/update`, 'PUT', {event_id,tagline,text_description, time_begin, time_end});
}
export const getDates = async(month: number, year: number) => {
    return fetchAPI(`/events/getdates/${month}/${year}`, 'GET');
}
export const getFollowedDates = async(month: number, year: number, user_id: number) => {
    return fetchAPI(`/events/getfolloweddates/${month}/${year}/${user_id}`, 'GET');
}
export const getUserDates = async(month: number, year: number, user_id: number) => {
    return fetchAPI(`/events/getuserdates/${month}/${year}/${user_id}`, 'GET');
}
export const getDayEvents = async(bottom: Date, top: Date) => {
    return fetchAPI(`/events/getdayevents/${bottom}/${top}`, 'GET');
}
export const getFollowedEvents = async(bottom: Date, top: Date, user_id: number) => {
    return fetchAPI(`/events/getfollowedevents/${bottom}/${top}/${user_id}`, 'GET');
}
export const getUserEvents = async(bottom: Date, top: Date, user_id: number) => {
    return fetchAPI(`/events/getuserevents/${bottom}/${top}/${user_id}`, 'GET');
}
//create a user event
export const createUserEvents = async(user_id:number, name: string, tagline: string, text_description: string, time_begin: Date, time_end: Date) => {
    return fetchAPI(`/events/createuserevents`, 'POST', {user_id, name, tagline, text_description, time_begin, time_end});
}