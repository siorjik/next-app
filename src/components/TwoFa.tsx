import { Button, Form, Input } from 'antd'

import setFormNumberValue from '@/helpers/setFormNumberValue'

const { Item } = Form

const TwoFa = ({ onSubmit }: { onSubmit: (code: string) => Promise<void> }) => {
  const [form] = Form.useForm()

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={({ code }: { code: string }) => onSubmit(code)}
      onValuesChange={({ code }: { code: string }) => code && setFormNumberValue(code, form, 'code')}
    >
      <Item name='code' label='Verification code' rules={[{ required: true, message: 'Input verification code!' }]}>
        <Input className='h-50 w-120 fs-25' maxLength={6} />
      </Item>
      <Button type='primary' htmlType='submit'>Submit</Button>
    </Form>
  )
}

export default TwoFa
