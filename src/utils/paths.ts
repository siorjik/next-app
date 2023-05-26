export const loginAppPath = '/login'
export const userCreatingAppPath = '/user-creating'
export const passwordCreatingAppPath = '/password-creating'

// user
export const usersAppPath = '/users'
export const userCreateAppPath = `${usersAppPath}/create`
export const getUserAppPath = (id: number) => `${usersAppPath}/${id}`
export const getUserUpdateAppPath = (id: number | string) => `${usersAppPath}/${id}/update`

/*-----------------local api paths---------------------------*/
// user
export const localApiUserCreatePath = '/api/user/create'
export const localApiUserCreatePasswordPath = '/api/user/create-password'
export const getLocalApiUserUpdatePath = (id: string) => `/api/user/${id}/update`
export const getLocalApiUserDeletePath = (id: number) => `/api/user/${id}/delete`

/*-----------------api paths-----------------*/
// auth
export const apiLoginPath = '/auth/login'
export const apiRefreshPath = '/auth/refresh'
export const apiLogoutPath = '/auth/logout'

// user
export const apiUsersPath = '/user'
export const apiUserCreatePath = '/user/create'
export const apiUserCreatePasswordPath = '/user/create-password'
export const getApiUserPath = (id: string) => `${apiUsersPath}/${id}`
export const getApiUserUpdatePath = (id: string) => `/user/${id}/update`
export const getApiUserDeletePath = (id: number) => `/user/${id}/delete`
