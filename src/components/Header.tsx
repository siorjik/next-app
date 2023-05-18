import { Layout } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { usersAppPath } from '@/utils/paths'
import { signOut } from 'next-auth/react'
import { LogoutOutlined } from '@ant-design/icons'

const { Header } = Layout

const HeaderComp = () => {
  const { pathname } = useRouter()

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

  return (
    <Header>
      <div className="top-nav">
        {
          menuData.map((item, index) =>
            <Link key={index} className={`${pathname === item.href ? 'active' : ''}`} href={item.href}>{item.title}</Link>)
        }
      </div>
      <div className="btns-block"><LogoutOutlined onClick={() => signOut()} /></div>
    </Header>
  )
}

export default HeaderComp
