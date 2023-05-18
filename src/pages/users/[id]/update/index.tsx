import { Input, Form, Button, Select } from "antd"
import { useState } from "react"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"

import apiService from "@/services/apiService"
import Error from "@/components/Error"
import { UserType } from "@/types/userType"
import { getApiUserPath, getLocalApiUserUpdatePath } from '@/utils/paths'
import getServerSidePropsHelper from '@/helpers/getServerSidePropsHelper'
import { ApiErrorType } from '@/types/errorType'

const { Item } = Form

const Updating = ({ user }: { user: UserType }) => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })

  const { query } = useRouter()

  const onSubmit = async (values: { [k: string]: string | number | boolean }) => {
    const valuesCopy = { ...values }

    valuesCopy.isActive = !!values.isActive

    const result = await apiService.put(getLocalApiUserUpdatePath(query.id as string), valuesCopy)

    if (result.error) setErr(result)
    else setErr({ message: '', statusCode: 0, error: '' })
  }

  return (
    <>
      <h2>Updating page.</h2>

      <Form
        className='w-50-percent'
        layout='vertical'
        onFinish={onSubmit}
        initialValues={{ firstName: user.firstName, lastName: user.lastName, email: user.email, isActive: user.isActive ? 1 : 0 }}
      >
        <Item name='firstName' label='First Name' rules={[{ required: true, message: 'Please input your Last Name!' }]}>
          <Input />
        </Item>
        <Item name='lastName' label='Last Name' rules={[{ required: true, message: 'Please input your Last Name!' }]}>
          <Input />
        </Item>
        <Item 
          name='email' 
          label='Email'
          rules={[{ required: true, message: 'Please input your Email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
        >
          <Input type='email' />
        </Item>
        <Item name='isActive' label='Active'>
          <Select options={[{ value: 1, label: 'Yes' }, { value: 0, label:'No' }]} />
        </Item>
        <Item><Button type='primary' htmlType='submit'>Update</Button></Item>
      </Form>

      {err.error ? <Error error={err} className='w-50-percent' /> : null}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return await getServerSidePropsHelper(async() => await apiService.get(getApiUserPath(ctx.params!.id as string)), 'user')
}

export default Updating
