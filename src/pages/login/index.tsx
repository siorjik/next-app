import { ReactElement, useCallback, useEffect, useState } from 'react'
import { Alert, Row, Col } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { getSession, signIn, useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'

import Error from '@/components/Error'
import RecoveryModal from './RecoveryModal'

import {
  apiCheckTwoFaPath,
  apiResetTwoFaPath,
  apiUserRecoverPasswordPath,
  userCreatingAppPath,
  apiResetTwoEmailFaPath
} from '@/utils/paths'
import apiService from '@/services/apiService'
import { ApiErrorType } from '@/types/errorType'
import LoginForm from './LoginForm'

type ModalStateType = { isShow: boolean, isTwoFa: boolean, title: string, text: string | ReactElement }

const Login = () => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })
  const [isTwoFaStep, setTwoFaStep] = useState(false)
  const [alert, setAlert] = useState<{ isShow: boolean, text: string, isErr: boolean }>({ isShow: false, text: '', isErr: false })
  const [modal, setModal] = useState<ModalStateType>({ isShow: false, isTwoFa: false, title: '', text: '' })

  const router = useRouter()
  const { data } = useSession()

  useEffect(() => {
    (async () => {
      const { resetTwoFa, token } = router.query

      if (resetTwoFa && token) {
        const result = await apiService({
          url: apiResetTwoFaPath,
          method: 'post',
          data: { token: token as string },
          isServer: false,
          withoutAuthFlow: true
        })

        if (!result.error) {
          setAlert({ ...alert, isShow: true, text: 'Your two factor verification was disabled' })
        } else setAlert({ isShow: true, text: 'Two factor verification reset error, link was expired', isErr: true })

        setTimeout(() => setAlert({ isErr: false, isShow: false, text: '' }), 5000)
      }
    })()
  }, [])

  useEffect(() => {
    if (data?.user.id) router.push('/')
  }, [data, router])

  const checkTwoFa = async (email: string) => (
    await apiService({
      url: apiCheckTwoFaPath,
      method: 'post',
      data: { email },
      withoutAuthFlow: true,
      isServer: false
    })
  )

  const onSubmit = useCallback(async (values: { email: string, password: string, code?: string }) => {
    if (isTwoFaStep) {
      const login = await signIn('credentials', { redirect: false, ...values })

      if (login?.error) setErr({ message: login.error })
    } else {
      const result = await checkTwoFa(values.email)

      if (result?.error) setErr(result)
      else if (!result.isTwoFa) {
        const login = await signIn('credentials', { redirect: false, ...values })

        if (login?.error) setErr({ message: login.error })
      } else setTwoFaStep(true)
    }
  }, [isTwoFaStep])

  const recoveryPassword = async (email: string) => {
    return await apiService({ url: apiUserRecoverPasswordPath, method: 'post', data: { email }, isServer: false })
  }

  const resetTwoFa = async (email: string, password: string) => {
    return await apiService({
      url: apiResetTwoEmailFaPath,
      method: 'post',
      data: { email, password },
      isServer: false,
      withoutAuthFlow: true
    })
  }

  const setModalData = useCallback((data: ModalStateType) => setModal({ ...data }), [modal])

  return (
    <>
      {
        alert.isShow &&
        <Row className='mt-20 p-10 position-absolute w-100-percent'>
          <Col xs={24} md={16} className='m-auto'>
            <Alert message={alert.text} type={alert.isErr ? 'error' : 'warning'} showIcon />
          </Col>
        </Row>
      }

      <div className='primary-form'>
        <LoginForm onSubmit={onSubmit} isTwoFaStep={isTwoFaStep} />  
        <Error error={err} respWidth={{ xs: 24 }} />

        <Link className='pt-10' href={userCreatingAppPath}>or create a new account</Link>
        <p className='mt-20 pointer' onClick={() => setModal({ ...modal, isShow: true, title: 'Password recovery' })}>
          Forgot your password?
        </p>
        <p
          className='pointer'
          onClick={() => setModal({ ...modal, isShow: true, isTwoFa: true, title: 'Two factor verification reset' })}
        >
          Reset two factor verification
        </p>

        <RecoveryModal
          recoveryPassword={recoveryPassword}
          resetTwoFa={resetTwoFa}
          modal={modal}
          setModal={setModalData}
        />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (session) return { redirect: { destination: '/', permanent: false } }

  return { props: {} }
}

export default Login
