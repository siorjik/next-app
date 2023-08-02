import { useState, useEffect } from 'react'
import { Button, Form, Input, Tabs, Row, Col, Alert } from 'antd'
import type { TabsProps } from 'antd'
import { getSession } from 'next-auth/react'

import Error from '@/components/Error'

import { ApiErrorType } from '@/types/errorType'
import apiService from '@/services/apiService'
import { getApiUserPath, getApiUserUpdatePasswordPath, getApiUserUpdatePath } from '@/utils/paths'
import { TokensType } from '@/types/tokenType'
import { UserType } from '@/types/userType'
import withAuth from '@/hoc/withAuth'

const { Item } = Form

type UserStateType = { firstName: string, lastName: string, email: string, id: string }

const Profile = ({ updateAuth }: { updateAuth: (tokens: TokensType) => {} }) => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })
  const [user, setUser] = useState<UserStateType>({ firstName: '', lastName: '', email: '', id: '' })
  const [isShowModal, setShowModal] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    (async () => {
      const session = await getSession()

      const userData: UserType = await apiService({ url: getApiUserPath(session?.user.id), method: 'get', isServer: false, updateAuth })

      setUser({ ...user, firstName: userData.firstName, lastName: userData.lastName, email: userData.email, id: String(userData.id) })
    })()
  }, [])

  useEffect(() => {
    if (isShowModal) setTimeout(() => setShowModal(false), 3000)
  }, [isShowModal])

  const onChange = () => {
    if (isShowModal) setShowModal(false)
  }

  const clearErrState = () => {
    if (err.message) setErr({ message: '', statusCode: 0, error: '' })
  }

  const onSubmit = async (values: { [k: string]: string | number }) => {
    const result = await apiService({
      url: `${getApiUserUpdatePath(user.id)}`,
      data: { ...values },
      method: 'patch',
      isServer: false,
      updateAuth,
    })

    if (result.error) setErr(result)
    else {
      clearErrState()
      setShowModal(true)
    }
  }

  const updatePassword = async (values: { [k: string]: string }) => {
    const { currentPass, newPass, confirmPass } = values

    if (newPass !== confirmPass) {
      setErr({ ...err, message: 'New password and confirm new password must be the same!' })

      return false
    } else clearErrState()

    const result = await apiService({
      url: `${getApiUserUpdatePasswordPath(user.id)}`,
      method: 'patch',
      data: { currentPass, newPass },
      isServer: false,
      updateAuth,
    })

    if (result.error) setErr(result)
    else {
      clearErrState()
      setShowModal(true)

      form.resetFields()
    }
  }

  const settingsForm = (
    <Row>
      <Col xs={24} md={16} lg={12}>
        <Form layout='vertical' initialValues={{ ...user }} onFinish={onSubmit}>
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
          <Item><Button type='primary' htmlType='submit'>Edit</Button></Item>
        </Form>
      </Col>
    </Row>
  )

  const passwordForm = (
    <Row>
      <Col xs={24} md={16} lg={12}>
        <Form form={form} layout='vertical' onFinish={updatePassword}>
          <Item
            name='currentPass'
            label='Enter your current password'
            rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: '6 signs minimum' }]}
          >
            <Input.Password />
          </Item>
          <Item
            name='newPass'
            label='Enter your new password'
            rules={[{ required: true, message: 'Please confirm your password!' }, { min: 6, message: '6 signs minimum' }]}
          >
            <Input.Password />
          </Item>
          <Item
            name='confirmPass'
            label='Confirm your new password'
            rules={[{ required: true, message: 'Please confirm your password!' }, { min: 6, message: '6 signs minimum' }]}
          >
            <Input.Password />
          </Item>
          <Item><Button type='primary' htmlType='submit'>Change Password</Button></Item>
        </Form>
      </Col>
    </Row>
  )

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Settings',
      children: user.firstName && settingsForm
    },
    {
      key: '2',
      label: 'Password',
      children: passwordForm
    },
    {
      key: '3',
      label: 'Two Factor Verification',
      children: 'Two fa'
    }
  ]

  return (
    <div className='w-90-percent m-auto'>
      <Tabs defaultActiveKey='1' items={tabItems} onChange={onChange} />
      {err.message ? <Error error={err}/> : null}
      {isShowModal && <Alert message='Data was updated...' type="success" showIcon />}
    </div>
  )
}

export default withAuth(Profile)
