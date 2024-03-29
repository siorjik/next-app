import { Input, Form, Button, Alert } from "antd"
import { useState } from "react"
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import apiService from "@/services/apiService"
import Error from "@/components/Error"
import { apiUserCreatePath, loginAppPath } from '@/utils/paths'
import { ApiErrorType } from '@/types/errorType'

const { Item } = Form

const UserCreating = () => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })
  const [isShowAlert, setShowAlert] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const onSubmit = async (values: { [k: string]: string | number }) => {
    setLoading(true)

    const result = await apiService({
      url: apiUserCreatePath,
      data: { ...values, isActive: false },
      method: 'post', isServer: false
    })
    
    if (result.error) setErr(result)
    else {
      setErr({ message: '', statusCode: 0, error: '' })
      setShowAlert(true)

      form.resetFields()
    }

    setLoading(false)
  }

  return (
    <div className='primary-form'>
      <h2>New account creating</h2>

      <Form form={form} layout='vertical' onFinish={onSubmit}>
        <Item name='firstName' label='First Name' rules={[{ required: true, message: 'Please input your Last Name!' }]}>
          <Input />
        </Item>
        <Item name='lastName' label='Last Name' rules={[{ required: true, message: 'Please input your Last Name!' }]}>
          <Input />
        </Item>
        <Item 
          name='email' 
          label='Email' 
          rules={[
            { required: true, message: 'Please input your Email!' },
            { type: 'email', message: 'The input is not valid E-mail!' }
          ]}
        >
          <Input type='email' />
        </Item>
        <Item><Button type='primary' htmlType='submit' loading={isLoading}>Create</Button></Item>
      </Form>

      <Error error={err} respWidth={{ xs: 24 }} />

      {isShowAlert && <Alert message='Account was created. Check your mail to continue...' type="success" showIcon />}

      <Link className='pt-10' href={loginAppPath}>go to login page</Link>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) return { redirect: { destination: '/', permanent: false } }

  return { props: {} }
}

export default UserCreating
