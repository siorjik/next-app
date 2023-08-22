import { ReactElement, memo, useState } from 'react'
import { Form, Input, Modal, Alert } from 'antd'

import Error from '@/components/Error'
import Spinner from '@/components/Spinner'

import { ApiErrorType } from '@/types/errorType'

const { Item } = Form

type ModalStateType = { isShow: boolean, isTwoFa: boolean, title: string, text: string | ReactElement }
type PropsType = {
  recoveryPassword: (email: string, code?: string | undefined) => Promise<string | ApiErrorType>,
  resetTwoFa: (email: string, password: string) => Promise<string | ApiErrorType>
  modal: ModalStateType
  setModal: ({ isShow, text, title, isTwoFa }: ModalStateType) => void
}

const RecoveryModal = ({ recoveryPassword, resetTwoFa, modal, setModal }: PropsType) => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })
  const [isLoading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const handleOk = async () => {
    if (modal.text) clearModalState()
    else if (
      form?.getFieldError('email').length ||
      (modal.isTwoFa && (form?.getFieldError('email').length || form?.getFieldError('password').length))
    ) return
    else if (
      !form.getFieldValue('email') ||
      (modal.isTwoFa && (!form.getFieldValue('email') || !form.getFieldValue('password')))
    ) form.validateFields()
    else {
      const { email, password } = form.getFieldsValue()
      let result

      setLoading(true)

      if (!modal.isTwoFa) {
        result = await recoveryPassword(email)
      } else {
        result = await resetTwoFa(email, password)
      }

      if (typeof result !== 'string' && result.error) {
        setLoading(false)
        return setErr(result)
      }

      form.resetFields()

      setModal({ ...modal, text: 'Done! Check your email please' })
      setLoading(false)
    }
  }

  const onCancel = () => {
    form.resetFields()

    clearModalState()
    clearErrState()
    setLoading(false)
  }

  const clearModalState = () => setModal({ isShow: false, text: '', isTwoFa: false, title: '' })
  const clearErrState = () => setErr({ message: '', statusCode: 0, error: '' })

  return (
    <Modal
      title={modal?.title}
      open={modal?.isShow}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <>
        <Spinner styleName='spinner-small' isLoading={isLoading} size='small' />
        {modal?.text ? <Alert type='success' message={modal.text} /> : <>
          <p>{modal?.isTwoFa ? 'Please enter your email and password...' : 'Please enter your email...'}</p>
          <Form form={form} onValuesChange={() => clearErrState()}>
            <>
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
              {
                modal?.isTwoFa &&
                <Item name='password' label='Password' rules={[{ required: true, message: 'Please input your Password!' }]}>
                  <Input.Password />
                </Item>
              }
            </>
          </Form>
        </>}
      </>
      <Error error={err} className='mb-20' />
    </Modal>
  )
}

export default memo(RecoveryModal)
