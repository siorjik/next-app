import { useState } from 'react'
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from 'next/router'
import { Card, Space } from 'antd'
import { DeleteFilled, EditFilled } from '@ant-design/icons'

import { UserType } from "@/types/userType"
import apiService from "@/services/apiService"
import { apiUsersPath, getLocalApiUserDeletePath, getUserAppPath, getUserUpdateAppPath } from '@/utils/paths'
import requestWithAuthHelper from '@/helpers/getServerSidePropsHelper'

const User = ({ users }: { users: UserType[] }) => {
  const [userList, setUserList] = useState<UserType[]>(users)

  const router = useRouter()

  const remove = async (id: number) => {
    const result = await apiService.delete(getLocalApiUserDeletePath(id))

    if (result.error) router.replace('/error?signOut=true')
    else setUserList(userList.filter(user => user.id !== id))
  }

  return (
    <>
      <h2 className='mb-30'>Users page</h2>
      <Space direction='vertical'>
        {
          userList && userList.map((user: UserType) => (
            <Card 
              key={user.id}
              title={`${user.firstName} ${user.lastName}`}
              extra={<Link className='ml-20' href={getUserAppPath(user.id)}>Details</Link>}
            >
              <div className='flex j-content-space-around'>
                <Link href={getUserUpdateAppPath(user.id)}><EditFilled style={{ fontSize: '25px', cursor: 'pointer', color: 'grey' }} /></Link>
                <DeleteFilled style={{ fontSize: '25px', cursor: 'pointer', color: 'grey' }} onClick={() => remove(user.id)} />
              </div>
            </Card>
          ))
        }
      </Space>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return await requestWithAuthHelper(async() => await apiService.get(apiUsersPath), 'users')
}

export default User
