import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import apiService from '@/services/apiService'
import { apiLoginPath, apiLogoutPath } from '@/utils/paths'

import type { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          const user = await apiService.post(apiLoginPath, credentials!, false)

          if (user.data) {
            if (!user.data.error) {
              const cookie = user.headers['set-cookie'].find((item: string) => item.includes('refresh'))

              res.setHeader('Set-Cookie', cookie)

              apiService.setCookie(cookie)
            }

            return user.data
          } else return null
        }
      })
    ],

    session: {
      strategy: 'jwt',
    },

    callbacks: {
      jwt: async ({ token, user }) => {
        return { ...token, ...user }
      },
      session: async ({ session, token }) => {
        session.user = token
        session.apiUrl = process.env.API_HOST!

        apiService.setAuth(session.user.token)

        return session
      }
    },

    events: {
      signOut: async () => {
        await apiService.post(apiLogoutPath, {})
        
        apiService.clearSettings()
      }
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
      signIn: '/login',
    }
  })
}
