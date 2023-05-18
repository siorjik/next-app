import { GetServerSideProps } from "next"
import Link from 'next/link'
import { useRouter } from "next/router"

import { UserType } from "@/types/userType"
import apiService from "@/services/apiService"
import { getApiUserPath, getUserUpdateAppPath } from '@/utils/paths'
import getServerSidePropsHelper from '@/helpers/getServerSidePropsHelper'

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
  return await getServerSidePropsHelper(async() => await apiService.get(getApiUserPath(ctx.params!.id as string)), 'user')
}

export default User
