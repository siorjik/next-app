import axios from 'axios'

export const setToken = (token: string) => axios.defaults.headers.common.Authorization = `Bearer ${token}`

export const setCookie = (cookie: string) => axios.defaults.headers.common['Set-Cookie'] = cookie

export const setBaseUrl = (baseUrl: string) => axios.defaults.baseURL = baseUrl
