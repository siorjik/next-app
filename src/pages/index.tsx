import { usersAppPath } from '@/utils/paths'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      <h2>Home Page</h2>
      <Link href={usersAppPath}>Go to users page</Link>
    </>
  )
}
export default Home
