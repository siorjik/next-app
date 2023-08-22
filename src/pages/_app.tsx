import { useEffect, useState } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

import 'antd/dist/reset.css'
import '@/styles/index.scss'

import Layout from '@/components/Layout'
import {
  loginAppPath,
  passwordCreatingAppPath,
  passwordRecoverAppPath,
  profileAppPath,
  userCreatingAppPath
} from '@/utils/paths'
import LayoutWithoutSidebar from '@/components/Layout/LayoutWithoutSidebar'
import Spinner from '@/components/Spinner'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isLoading, setLoading] = useState(false)

  const { pathname, events } = useRouter()

  useEffect(() => {
    events.on('routeChangeStart', () => setLoading(true))
    events.on('routeChangeComplete', () => setLoading(false))
    events.on('routeChangeError', () => setLoading(false))

    return () => {
      events.off('routeChangeStart', () => setLoading(true))
      events.off('routeChangeComplete', () => setLoading(false))
      events.off('routeChangeError', () => setLoading(false))
    }
  }, [])

  if (isLoading) return <Spinner />

  if (
    pathname === loginAppPath ||
    Component.displayName === '404' ||
    pathname === '/error' ||
    pathname === userCreatingAppPath ||
    pathname === passwordCreatingAppPath ||
    pathname === passwordRecoverAppPath
  ) {
    return <SessionProvider session={session}><Component {...pageProps} /></SessionProvider>
  } else if (pathname === profileAppPath) {
    return (
      <SessionProvider session={session}>
        <LayoutWithoutSidebar><Component {...pageProps} /></LayoutWithoutSidebar>
      </SessionProvider>)
  }

  return <SessionProvider session={session}><Layout><Component {...pageProps} /></Layout></SessionProvider>
}
