import { io } from 'socket.io-client'
import { getSession } from 'next-auth/react'
import { GetServerSidePropsContext } from 'next'

export default async (ctx: GetServerSidePropsContext | undefined = undefined) => {
  const session = await getSession(ctx)

  return io(session?.apiUrl.replace('/api', '') as string)
}
