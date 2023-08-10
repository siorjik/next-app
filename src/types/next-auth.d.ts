import NextAuth from "next-auth"
import { JWT } from 'next-auth/jwt'

declare module "next-auth" {
  interface Session {
    user: {
      id: number,
      email: string,
      isActive: boolean,
      accessToken: string,
      refreshToken: string,
      firstName: string,
      lastName: string,
      error?: [string] | string,
      isTwoFa: boolean,
      twoFaHash: string | null
    } & typeof JWT
  }
}
