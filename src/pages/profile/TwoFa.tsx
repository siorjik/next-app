import { useEffect, useState } from 'react'
import { Button, Form, QRCode, Row, Col, Input } from 'antd'

const { Item } = Form

const TwoFa = ({
  enableTwoFa, disableTwoFa, confirmTwoFa, isTwoFa
}: {
  isTwoFa: boolean,
  enableTwoFa: () => Promise<{ qrCodeUrl: string }>,
  disableTwoFa: () => Promise<void>,
  confirmTwoFa: (code: string) => Promise<void>
}) => {
  const [isActive, setActive] = useState(false)
  const [qrUrl, setQrUrl] = useState('')

  const [form] = Form.useForm()

  useEffect(() => {
    (async () => {
      if (isActive) {
        const url = await enableTwoFa()

        setQrUrl(url.qrCodeUrl)
      }
    })()
  }, [isActive])

  useEffect(() => {
    if (isTwoFa) {
      setActive(false)
      setQrUrl('')
    }
  }, [isTwoFa])

  const onSubmit = async (values: { code: string }) => await confirmTwoFa(values.code)

  const onChangeCode = (values: { code: string }) => {
    if (isNaN(+values.code)) form.setFieldValue('code', values.code.substring(0, values.code.length - 1))
  }

  return (
    <>
      {
        isTwoFa ? <>
          <h3>Your two factor vericfication is enable.</h3>
          <Button className='mb-20 mt-20' type='default' onClick={disableTwoFa}>Disable Two Factor Verification</Button>
        </> :
          <Button className='mb-20' type='default' onClick={() => setActive(true)} disabled={!!qrUrl}>
            Enable Two Factor Verification
          </Button>
      }
      {
        isActive && qrUrl &&
        <Row className='mb-20'>
          <Col xs={24} sm={6}>
            <QRCode className='mt-20 mb-20' value={qrUrl} />
            <Form form={form} layout='vertical' onFinish={onSubmit} onValuesChange={onChangeCode}>
              <Item name='code' label='Verification code' rules={[{ required: true, message: 'Input verification code!' }]}>
                <Input className='h-50 w-120 fs-25' maxLength={6} />
              </Item>
              <Button type='primary' htmlType='submit'>Submit</Button>
            </Form>
          </Col>
        </Row>
      }
    </>
  )
}

export default TwoFa
