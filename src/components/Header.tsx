import { Layout } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession, signOut } from 'next-auth/react'

import { apiLogoutPath, profileAppPath, usersAppPath } from '@/utils/paths'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import apiService from '@/services/apiService'
import { TokensType } from '@/types/tokenType'

const { Header } = Layout

const HeaderComp = ({ updateAuth }: { updateAuth?: (tokens: TokensType) => {} }) => {
  const { pathname, push } = useRouter()

  const menuData = [
    {
      title: 'Home',
      href: '/'
    },
    {
      title: 'Users',
      href: usersAppPath
    }
  ]

  const logOut = async () => {
    const session = await getSession()

    await apiService({
      url: `${apiLogoutPath}?refresh=${session?.user.refreshToken}`,
      method: 'get',
      isServer: false,
      updateAuth,
      isLogOut: true
    })

    signOut()
  }

  return (
    <Header>
      <div className="top-nav">
        {
          menuData.map((item, index) =>
            <Link key={index} className={`${pathname === item.href ? 'active' : ''}`} href={item.href}>{item.title}</Link>)
        }
      </div>
      <div className="btns-block">
        <UserOutlined onClick={() => push(profileAppPath)} />
        <LogoutOutlined className='ml-20' onClick={logOut} />
      </div>
    </Header>
  )
}

export default HeaderComp
