import Link from 'next/link'
import { useSession } from 'next-auth/react'

const NotFoundPage = () => {
  const { data } = useSession()
  
  return (
    <>
      <h2>404 page</h2>
      <Link href='/'>Go to {data ? 'Home' : 'Login'} page</Link>
    </>
  )
}

NotFoundPage.displayName = '404'

export default NotFoundPage
