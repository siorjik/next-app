import { ReactElement, useEffect, useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getSession, signIn, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import Error from '@/components/Error'
import { apiCheckTwoFaPath, apiUserRecoverPasswordPath, userCreatingAppPath } from '@/utils/paths'
import apiService from '@/services/apiService'
import { ApiErrorType } from '@/types/errorType'
import setFormNumberValue from '@/helpers/setFormNumberValue'

const { Item } = Form

const Login = () => {
  const [modal, setModal] = useState<{ text: string | ReactElement, isShow: boolean }>({ text: '', isShow: false })
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })
  const [isTwoFaStep, setTwoFaStep] = useState(false)

  const router = useRouter()
  const { data } = useSession()

  const [form] = Form.useForm()
  const [loginForm] = Form.useForm()

  useEffect(() => {
    if (data?.user.id) router.push('/')
  }, [data, router])

  const onSubmit = async (values: { email: string, password: string, code?: string }) => {
    if (isTwoFaStep) {
      const login = await signIn('credentials', { redirect: false, ...values })

      if (login?.error) setErr({ message: login.error })
    } else {
      const result = await apiService({
        url: apiCheckTwoFaPath,
        method: 'post',
        data: { email: values.email },
        isLogIn: true,
        isServer: false
      })

      if (result?.error) setErr(result)
      else if (!result.isTwoFa) {
        const login = await signIn('credentials', { redirect: false, ...values })

        if (login?.error) setErr({ message: login.error })
      } else setTwoFaStep(true)
    }
  }

  const handleOk = async () => {
    if (modal.text) setModal({ isShow: false, text: '' })
    else if (form?.getFieldError('email').length) return
    else if (!form.getFieldValue('email')) form.validateFields()
    else {
      const email = form.getFieldValue('email') as string

      const result =
        await apiService({ url: apiUserRecoverPasswordPath, method: 'post', data: { email }, isServer: false })

      form.resetFields()

      setModal({
        ...modal,
        text: !result.error ? 'Done! Check your email please' : <span className='error'>{result.message}</span>
      })
    }
  }

  const onCancel = () => {
    form.resetFields()

    setModal({ isShow: false, text: '' })
  }

  return (
    <div className='primary-form'>
      <h2>Login</h2>

      <Form
        form={loginForm}
        layout='vertical'
        onFinish={onSubmit}
        onValuesChange={({ code }: { code: string }) => code && setFormNumberValue(code, loginForm, 'code')}
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

      <Error error={err} respWidth={{ xs: 24 }} />

      <Link className='pt-10' href={userCreatingAppPath}>or create a new account</Link>
      <p className='mt-20 pointer' onClick={() => setModal({ ...modal, isShow: true })}>Forgot your password?</p>

      <Modal
        title='Password recovery'
        open={modal.isShow}
        onOk={handleOk}
        onCancel={onCancel}
      >
        <p>Please enter your email...</p>
        <Form form={form}>
          {modal.text ? <p>{modal.text}</p> :
            <Item
              name='email'
              label='Email'
              rules={[
                { required: true, message: 'Please input your Email!' },
                { type: 'email', message: 'The input is not valid E-mail!' }
              ]}
            >
              <Input type='email' />
            </Item>}
        </Form>
      </Modal>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) return { redirect: { destination: '/', permanent: false } }

  return { props: {} }
}

export default Login
