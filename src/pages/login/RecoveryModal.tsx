import { ReactElement, memo, useState } from 'react'
import { Form, Input, Modal, Alert } from 'antd'
import { ApiErrorType } from '@/types/errorType'
import Error from '@/components/Error'

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

      if (!modal.isTwoFa) {
        result = await recoveryPassword(email)
      } else {
        result = await resetTwoFa(email, password)
      }

      if (typeof result !== 'string' && result.error) return setErr(result)

      form.resetFields()

      setModal({ ...modal, text: 'Done! Check your email please' })
    }
  }

  const onCancel = () => {
    form.resetFields()

    clearModalState()
    clearErrState()
  }

  const clearModalState = () => setModal({ isShow: false, text: '', isTwoFa: false, title: '' })
  const clearErrState = () => setErr({ message: '', statusCode: 0, error: '' })

  const modalPassContent = (
    <>
      {modal?.text ? <Alert type='success' message={modal.text} /> : <>
        <p>Please enter your email...</p>
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
          </>
        </Form>
      </>
      }
    </>
  )

  const modalTwoFaContent = (
    <>
      {modal?.text ? <Alert type='success' message={modal.text} /> : <>
        <p>Please enter your email and password...</p>
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
            <Item name='password' label='Password' rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input.Password />
            </Item>
          </>
        </Form>
      </>
      }
    </>
  )

  return (
    <Modal
      title={modal?.title}
      open={modal?.isShow}
      onOk={handleOk}
      onCancel={onCancel}
    >
      {modal?.isTwoFa ? modalTwoFaContent : modalPassContent}
      <Error error={err} className='mb-20' />
    </Modal>
  )
}

export default memo(RecoveryModal)
