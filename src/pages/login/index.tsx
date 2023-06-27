import { useEffect } from 'react'
import { Button, Form, Input } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getSession, signIn, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import Error from '@/components/Error'
import { userCreatingAppPath } from '@/utils/paths'

const { Item } = Form

const Login = () => {
  const router = useRouter()
  const { data } = useSession()

  useEffect(() => {
    if (data?.user.id) router.push('/')
  }, [data, router])

  const onSubmit = async (values: { email: string, password: string }) => {
    await signIn('credentials', { redirect: false, ...values })
  }

  return (
    <div className='primary-form'>
      <h2>Login</h2>

      <Form
        layout='vertical'
        onFinish={onSubmit}
      >
        <Item
          name='email'
          label='Email'
          rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
        >
          <Input type='email' />
        </Item>
        <Item name='password' label='Password' rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input.Password />
        </Item>
        <Item><Button type='primary' htmlType='submit'>Login</Button></Item>
      </Form>

      {data?.user?.error?.length ? <Error error={data.user} /> : null}

      <Link className='pt-10' href={userCreatingAppPath}>or create a new account</Link>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) return { redirect: { destination: '/', permanent: false } }

  return { props: {} }
}

export default Login
