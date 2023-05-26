import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import { loginAppPath } from '@/utils/paths'

const Err = ({ isSignOut }: { isSignOut: boolean }) => {
  const { asPath } = useRouter()

  const isLogOut = asPath.includes('signOut=true') || isSignOut

  useEffect(() => {
    if (isLogOut) {
      setTimeout(() => signOut({ redirect: true, callbackUrl: loginAppPath }), 3000)
    }
  }, [isSignOut])

  return (
    <div className='h-100-vh flex flex-direction-column j-content-center a-items-center'>
      <h2 className='error'>Error!</h2>
      {isLogOut ? <p>Your session was expired, redirecting to Login page...</p> : <Link href="/">Go to home</Link>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { isSignOut: !!ctx.query.signOut } }
}

export default Err
