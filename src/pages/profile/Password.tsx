import { useState } from 'react'
import { Button, Col, Form, FormInstance, Input, Row } from 'antd'

const { Item } = Form

const PasswordForm = ({
  form, updatePassword
}: { 
  form: FormInstance, updatePassword: (values: { [k: string]: string; }) => Promise<false | undefined>
}) => {
  const [isLoading, setLoading] = useState(false)

  const onFinish = async (values: { currentPass: string, newPass: string, confirmPass: string }) => {
    setLoading(true)

    await updatePassword({ ...values })

    setLoading(false)
  }

  return (
    <Row>
      <Col xs={24} md={16} lg={12}>
        <Form form={form} layout='vertical' onFinish={onFinish}>
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
          <Item><Button type='primary' htmlType='submit' loading={isLoading}>Change Password</Button></Item>
        </Form>
      </Col>
    </Row>
  )
}

export default PasswordForm
