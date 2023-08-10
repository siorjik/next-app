import { useRouter } from 'next/router'
import { Input, Form, Button, message } from "antd"
import { useState } from "react"
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import apiService from "@/services/apiService"
import Error from "@/components/Error"
import { apiUserCreatePasswordPath, loginAppPath, userCreatingAppPath } from '@/utils/paths'
import { ApiErrorType } from '@/types/errorType'

type ObjType = { [k: string]: string | number }

const { Item } = Form

const PasswordCreating = () => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })

  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  const { query, push } = useRouter()

  const onSubmit = async (values: ObjType) => {
    const { pass, passConfirm } = values

    if (pass !== passConfirm) {
      setErr({ message: 'Password and Confirm password must be the same!' })

      return false
    }

    const result = await apiService({
      url: apiUserCreatePasswordPath,
      data: { password: pass, token: query.accessToken as string },
      method: 'post',
      isServer: false,
    })
    
    if (result.error) {
      setErr(result)

      setTimeout(() => push(userCreatingAppPath), 3000)
    } else {
      setErr({ message: '', statusCode: 0, error: '' })

      messageApi.success('Password was created. Redirecting to login page...')
      form.resetFields()

      setTimeout(() => push(loginAppPath), 3000)
    }
  }

  return (
    <div className='primary-form'>
      <h2>Password creating</h2>

      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Item
          name='pass'
          label='Enter your password'
          rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: '6 signs minimum' }]}
        >
          <Input.Password />
        </Item>
        <Item
          name='passConfirm'
          label='Confirm your password'
          rules={[{ required: true, message: 'Please confirm your password!' }, { min: 6, message: '6 signs minimum' }]}
        >
          <Input.Password />
        </Item>
        <Item><Button type='primary' htmlType='submit'>Create Password</Button></Item>
      </Form>

      {err.message ? <Error error={err} /> : null}

      {contextHolder}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) return { redirect: { destination: '/', permanent: false } }

  return { props: {} }
}

export default PasswordCreating
