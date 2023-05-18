import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

import 'antd/dist/reset.css'
import '@/styles/index.scss'

import Layout from '@/components/Layout'
import { loginAppPath } from '@/utils/paths'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { pathname } = useRouter()

  if (pathname === loginAppPath || Component.displayName === '404' || pathname === '/error') {
    return <SessionProvider session={session}><Component {...pageProps} /></SessionProvider>
  }

  return <SessionProvider session={session}><Layout><Component {...pageProps} /></Layout></SessionProvider>
}
