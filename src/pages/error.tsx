import { useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import { loginAppPath } from '@/utils/paths'

const Err = ({ isSignOut }: { isSignOut: boolean }) => {
  useEffect(() => {
    if (isSignOut) {
      setTimeout(() => signOut({ redirect: true, callbackUrl: loginAppPath }), 3000)
    }
  }, [isSignOut])

  return (
    <div className='h-100-vh flex flex-direction-column j-content-center a-items-center'>
      <h2 className='error'>Error!</h2>
      {isSignOut ? <p>Your session was expired, redirecting to Login page...</p> : <Link href="/">Go to home</Link>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { isSignOut: !!ctx.query.signOut } }
}

export default Err
