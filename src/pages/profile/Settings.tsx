import { Button, Col, Form, Input, Row } from 'antd'

import { ProfileUserType } from '@/types/userType'

const { Item } = Form

const Settings = ({
  user, onSubmit
}: {
  user: ProfileUserType, onSubmit: (values: { [k: string]: string | number }) => Promise<void>
}) => {
  return (
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
}

export default Settings
