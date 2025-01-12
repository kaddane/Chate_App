
export const HOST = import.meta.env.VITE_SERVER_URL

export const AUTH_ROUTE = "api/auth"
export const SIGNUP_ROUTE = `${AUTH_ROUTE}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`
export const GET_USER_INFO = `${AUTH_ROUTE}/user-info`
export const UPDATE_PROFOLE_INFO = `${AUTH_ROUTE}/update-profile`
export const ADD_IMAGE_ROUTE = `${AUTH_ROUTE}/add-profile-image`
export const REMOVE_PROGILE_IMAGE_ROUTE = `${AUTH_ROUTE}/remove-profile-image`
export const LOGOUT_ROUTE = `${AUTH_ROUTE}/logout`


// api/contacts

export const CONTACTS_ROUTE = "api/contacts"
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/search` 
export const GET_DM_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-contacts-for-md` 





// api/ messages


export const MESSAGES_ROUTE = "api/messages"
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTE}/uplaod-file` 








