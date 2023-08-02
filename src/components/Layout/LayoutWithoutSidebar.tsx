import { ReactNode } from "react"
import { Layout } from "antd"

import Header from '../Header'

const { Footer, Content } = Layout

const LayoutWithoutSidebar = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Layout>
        <Header />
        <div className='flex'>
          <Content>{children}</Content>
        </div>
        <Footer></Footer>
      </Layout>
    </>
  )
}

export default LayoutWithoutSidebar
