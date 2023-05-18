import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import { GetServerSideProps } from 'next'

const Err = ({ isSignOut }: { isSignOut: boolean }) => {
  const { asPath } = useRouter()

  useEffect(() => {
    if (asPath.includes('signOut=true') || isSignOut) {

      setTimeout(() => signOut(), 0)

      window.location.href = '/login'
    }
  }, [isSignOut])

  return (
    <>
      <h2>Error!</h2>
      <Link href="/">Go to home</Link>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return { props: { isSignOut: !!ctx.query.signOut } }
}

export default Err
