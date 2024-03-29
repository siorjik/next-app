export const loginAppPath = '/login'
export const userCreatingAppPath = '/user-creating'
export const passwordCreatingAppPath = '/password-creating'
export const passwordRecoverAppPath = '/password-recovery'
export const profileAppPath = '/profile'

// user
export const usersAppPath = '/users'
export const userCreateAppPath = `${usersAppPath}/create`
export const getUserAppPath = (id: number) => `${usersAppPath}/${id}`
export const getUserUpdateAppPath = (id: number | string) => `${usersAppPath}/${id}/update`

/*-----------------api paths-----------------*/
// auth
export const apiLoginPath = '/auth/login'
export const apiRefreshPath = '/auth/refresh'
export const apiLogoutPath = '/auth/logout'
export const apiTwoFaConfirmPath = '/auth/confirm-two-fa'
export const apiCheckTwoFaPath = '/auth/check-two-fa'
export const apiResetTwoFaPath = '/auth/reset-two-fa'
export const apiResetTwoEmailFaPath = '/auth/reset-two-fa/email'
export const getApiTwoFaPath = (id: string) => `/auth/${id}/two-fa`

// user
export const apiUsersPath = '/user'
export const apiUserCreatePath = '/user/create'
export const apiUserCreatePasswordPath = '/user/create-password'
export const apiUserRecoverPasswordPath = '/user/recover-password'
export const getApiUserPath = (id: string) => `${apiUsersPath}/${id}`
export const getApiUserUpdatePath = (id: string) => `/user/${id}/update`
export const getApiUserDeletePath = (id: number) => `/user/${id}/delete`
export const getApiUserUpdatePasswordPath = (id: number | string) => `/user/${id}/update-password`
