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

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { pathname } = useRouter()

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
