import { io } from 'socket.io-client'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'

export default async (ctx: GetServerSidePropsContext | undefined = undefined) => {
  const session = await getSession(ctx)
  const url = (process.env.NEXT_PUBLIC_WEB_HOST! || process.env.NEXT_PUBLIC_API_HOST!).replace('/api', '')

  return io(url as string)
}
