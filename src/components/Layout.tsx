import { ReactNode, useState } from "react"
import { Layout } from "antd"

import Sidebar from './Sidebar'
import Header from './Header'

const { Footer, Content } = Layout

const LayoutComp = ({ children }: { children: ReactNode }) => {
  const [isShrink, setShrink] = useState(false)

  return (
    <>
      <Layout>
        <Header />
        <div className='flex'>
          <Sidebar isShrink={isShrink} shrinkMenu={() => setShrink(!isShrink)} />
          <Content className={`${isShrink ? 'shrink' : ''}`}>{children}</Content>
        </div>
        <Footer></Footer>
      </Layout>
    </>
  )
}

export default LayoutComp
