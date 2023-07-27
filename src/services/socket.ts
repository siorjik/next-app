import { io } from 'socket.io-client'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'

export default async (ctx: GetServerSidePropsContext | undefined = undefined) => {
  const session = await getSession(ctx)
  const url = (session?.user.webUrl || session?.user.apiUrl).replace('/api', '')

  return io(url as string)
}
