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
  data?: { [k: string]: string | number | boolean | null }
  isServer?: boolean,
  updateAuth?: (tokens: TokensType) => {}
  isLogOut?: boolean,
  withoutAuthFlow?: boolean,
}
type sessionUserType = UserType & { accessToken: '', refreshToken: '' }

export default async (params: ParamsType) => {
  let {
    url,
    method,
    ctx = undefined,
    name = '',
    data = {},
    isServer = true,
    updateAuth = () => { },
    isLogOut = false,
    withoutAuthFlow = false,
  } = params
  let session = { user: { accessToken: '', refreshToken: '' } }

  if (!withoutAuthFlow) {
    if (!isServer) session = { ...session, ...await getSession() }
    else session = { ...session, user: { ...await getToken({ req: ctx?.req as NextApiRequest }) } as sessionUserType }
  }

  const axiosInstance = axios.create({
    withCredentials: true, baseURL: (!isServer && process.env.NEXT_PUBLIC_WEB_HOST) || process.env.NEXT_PUBLIC_API_HOST
  })

  const setAuthHeader = (token: string) => axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
  const getRequest = async () => await axiosInstance[method as RequestMethodType](url, { ...data })
  const getLogOutUrl = (token: string) => `${apiLogoutPath}?refresh=${token}`

  try {
    setAuthHeader(session?.user.accessToken)

    const result = await getRequest()

    return isServer ? { props: { [name]: result.data } } : result.data
  } catch (error) {
    if (error.response!.status == 401) {
      if (withoutAuthFlow) return error.response.data

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
