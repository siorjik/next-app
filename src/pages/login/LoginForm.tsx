import { memo, useEffect } from 'react'
import { Button, Form, Input } from 'antd'

import setFormNumberValue from '@/helpers/setFormNumberValue'

type LoginPropsType = {
  onSubmit: (values: { email: string, password: string, code?: string }) => Promise<void> | void,
  isTwoFaStep: boolean,
  setTwoFaStep: () => void
}

const { Item } = Form

const LoginForm = ({ onSubmit, isTwoFaStep, setTwoFaStep }: LoginPropsType) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!isTwoFaStep && form.getFieldValue('code')) form.setFieldValue('code', '')
  }, [isTwoFaStep])

  const onValuesChange = ({ code, email }: { code: string, email: string }) => {
    if (code) setFormNumberValue(code, form, 'code')
    else if (email && isTwoFaStep) setTwoFaStep()
  }

  return (
    <>
      <h2>Login</h2>
      <Form
        form={form}
        layout='vertical'
        onFinish={() => onSubmit(form.getFieldsValue())}
        onValuesChange={onValuesChange}
      >
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
        <Item name='password' label='Password' rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input.Password />
        </Item>
        {isTwoFaStep &&
          <Item name='code' label='Verification Code' rules={[{ required: true, message: 'Please input verification code!' }]}>
            <Input className='h-50 w-120 fs-25' maxLength={6} />
          </Item>}
        <Item><Button type='primary' htmlType='submit'>Login</Button></Item>
      </Form>
    </>
  )
}

export default memo(LoginForm)
