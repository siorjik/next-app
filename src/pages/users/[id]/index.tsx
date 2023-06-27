import { GetServerSideProps } from "next"
import Link from 'next/link'
import { useRouter } from "next/router"

import { UserType } from "@/types/userType"
import apiService from "@/services/apiService"
import { getApiUserPath, getUserUpdateAppPath } from '@/utils/paths'
import withAuth from '@/hoc/withAuth'

const User = ({ user }: { user: UserType }) => {
  const { query } = useRouter()

  return (
    <>
      <h2>User page...</h2>

      <p>{user.firstName} {user.lastName}</p>

      <Link href={getUserUpdateAppPath(query.id as string)}>Update</Link>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await apiService({ url: getApiUserPath(ctx.params!.id as string), method: 'get', ctx, name: 'user' })
}

export default withAuth(User)
