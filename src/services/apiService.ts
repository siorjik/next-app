import axios from 'axios'
import { getSession } from 'next-auth/react'
import { getToken } from 'next-auth/jwt'
import Router from 'next/router'

import { apiLogoutPath, apiRefreshPath } from '@/utils/paths'
import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { TokensType } from '@/types/tokenType'
import { UserType } from '@/types/userType'

type RequestMethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'
type ParamsType = {
  url: string,
  method: string,
  name?: string,
  ctx?: GetServerSidePropsContext,
  data?: { [k: string]: string | number | boolean }
  isServer?: boolean,
  updateAuth?: (tokens: TokensType) => {}
  isLogOut?: boolean,
  isLogIn?: boolean,
}
type sessionUserType = {
  accessToken: '',
  refreshToken: '',
  apiUrl: '',
  webUrl: '',
}

export default async (params: ParamsType) => {
  let { url, method, ctx = undefined, name = '', data = {}, isServer = true, updateAuth = () => { }, isLogOut = false, isLogIn = false } = params
  let session = { user: { accessToken: '', refreshToken: '', apiUrl: '', webUrl: '' } }

  if (!isLogIn) {
    if (!isServer) session = { ...session, ...await getSession() }
    else session = { ...session, user: { ...await getToken({ req: ctx?.req as NextApiRequest }) } as sessionUserType & UserType }
  }

  const axiosInstance = axios.create({ withCredentials: true, baseURL: process.env.API_HOST || (session?.user.webUrl || session?.user.apiUrl) })

  const setAuthHeader = (token: string) => axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  const getRequest = async () => axiosInstance[method as RequestMethodType](url, { ...data })
  const getLogOutUrl = (token: string) => `${apiLogoutPath}?refresh=${token}`

  try {
    setAuthHeader(session?.user.accessToken)

    const result = await getRequest()

    return isServer ? { props: { [name]: result.data } } : result.data
  } catch (error) {
    if (error.response!.status == 401) {
      if (isLogIn) return error.response.data

      try {
        const tokens = await axiosInstance.get(`${apiRefreshPath}?refresh=${session?.user.refreshToken}`)

        if (tokens) {
          setAuthHeader(tokens.data.accessToken)

          try {
            if (isLogOut) url = getLogOutUrl(tokens.data.refreshToken)

            const result = await getRequest()

            if (isServer) return { props: { [name]: result.data, tokens: { ...tokens.data } } }
            else {
              updateAuth(tokens.data)

              return result.data
            }
          } catch (error) {
            if (!isServer) updateAuth(tokens.data)

            throw error
          }
        }
      } catch (error) {
        if (isServer) {
          return {
            redirect: {
              destination: error.response.status === 401 ? '/error?signOut=true' : '/error',
              permanent: false,
            }
          }
        } else {
          if (error.response.status === 401) return Router.push('/error?signOut=true')
          else return error.response.data
        }
      }
    } else {
      if (!isServer) return error.response.data

      return {
        redirect: {
          destination: '/error',
          permanent: false,
        }
      }
    }
  }
}
