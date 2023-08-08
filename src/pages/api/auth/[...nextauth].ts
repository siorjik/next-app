import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import apiService from '@/services/apiService'
import { apiLoginPath } from '@/utils/paths'

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
          const result =
            await apiService({ url: apiLoginPath, data: credentials, method: 'post', name: 'sessionUser', isLogIn: true })

          if (result.props && result.props.sessionUser) return result.props.sessionUser
          else throw new Error(result)
        }
      })
    ],

    session: {
      strategy: 'jwt',
    },

    callbacks: {
      jwt: async ({ token, user }) => {
        if (req.url?.includes('update')) {

          token = { ...token, accessToken: req.query.access, refreshToken: req.query.refresh }
        }

        return { ...user, ...token, apiUrl: process.env.API_HOST!, webUrl: process.env.WEB_HOST }
      },
      session: async ({ session, token }) => {
        session.user = token

        return session
      }
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
      signIn: '/login',
    }
  })
}
