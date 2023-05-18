import { useState, useEffect, ReactNode } from 'react'
import Link from "next/link"
import { useRouter } from 'next/router'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import { usersMenu } from './navigations/user'

const Sidebar = ({ isShrink, shrinkMenu }: { isShrink: boolean, shrinkMenu: () => void }) => {
  const [menu, setMenu] = useState<{ icon: ReactNode, path: string, label: string }[]>([])

  const { pathname } = useRouter()

  useEffect(() => {
    if (/^\/users\/*/.test(pathname)) setMenu(usersMenu)
    else setMenu([])
  }, [pathname])
  
  return (
    <aside className={`${isShrink ? 'shrink' : ''}`}>
      {
        !isShrink ? <MenuUnfoldOutlined className='icons mb-30' onClick={shrinkMenu} /> :
          <MenuFoldOutlined className='icons mb-30' onClick={shrinkMenu} />
      }
      <div className="side-nav">
        {
          menu.length ? menu.map(item =>
            <Link className={`${pathname === item.path ? 'active': ''}`} key={item.path} href={item.path}>
              <span>{item.icon}</span><span>{item.label}</span>
            </Link>) : null
        }
      </div>
    </aside>
  )
}

export default Sidebar
