import { Input, Form, Button } from "antd"
import { useState } from "react"

import apiService from "@/services/apiService"
import Error from "@/components/Error"
import { localApiUserCreatePath } from '@/utils/paths'
import { ApiErrorType } from '@/types/errorType'

const { Item } = Form

const Creating = () => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })

  const onSubmit = async (values: { [k: string]: string | number }) => {
    const result = await apiService.post(localApiUserCreatePath, values)
    
    if (result.error) setErr(result)
    else setErr({ message: '', statusCode: 0, error: '' })
  }

  return (
    <>
      <h2>Creating page.</h2>

      <Form className='w-50-percent' layout='vertical' onFinish={onSubmit}>
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
        <Item><Button type='primary' htmlType='submit'>Create</Button></Item>
      </Form>

      {err.error ? <Error error={err} className='w-50-percent' /> : null}
    </>
  )
}

export default Creating
