import { useState, useEffect } from 'react'
import { Form, Tabs, Alert } from 'antd'
import type { TabsProps } from 'antd'
import { getSession } from 'next-auth/react'

import Error from '@/components/Error'
import TwoFa from './TwoFa'
import Password from './Password'
import Settings from './Settings'

import { ApiErrorType } from '@/types/errorType'
import apiService from '@/services/apiService'
import {
  apiTwoFaConfirmPath,
  getApiTwoFaPath,
  getApiUserPath,
  getApiUserUpdatePasswordPath,
  getApiUserUpdatePath
} from '@/utils/paths'
import { TokensType } from '@/types/tokenType'
import { ProfileUserType, UserType } from '@/types/userType'
import withAuth from '@/hoc/withAuth'

const Profile = ({ updateAuth }: { updateAuth: (tokens: TokensType) => {} }) => {
  const [err, setErr] = useState<ApiErrorType>({ message: '', statusCode: 0, error: '' })
  const [user, setUser] = useState<ProfileUserType>({ firstName: '', lastName: '', email: '', id: '', isTwoFa: false })
  const [modal, setModal] = useState<{ isShow: boolean, text:string }>({ isShow: false, text: '' })

  const [form] = Form.useForm()

  useEffect(() => {
    (async () => {
      const session = await getSession()

      const user: UserType =
        await apiService({ url: getApiUserPath(session?.user.id), method: 'get', isServer: false, updateAuth })
      
      setStateUser(user)
    })()
  }, [])

  useEffect(() => {
    if (modal.isShow) setTimeout(() => setModal({ isShow: false, text: '' }), 3000)
    if (err.message) setTimeout(() => clearErrState(), 3000)
  }, [modal.isShow, err.message])

  const setStateUser = (user: UserType) => {
    const { firstName, lastName, email, id: userId, isTwoFa } = user

    setUser({ ...user, firstName, lastName, email, id: String(userId), isTwoFa })
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
      setModal({ isShow: true, text: 'Data was updated...' })
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
      setModal({ isShow: true, text: 'Data was updated...' })

      form.resetFields()
    }
  }

  const confirmTwoFa = async (code: string) => {
    const result = await apiService({
      url: apiTwoFaConfirmPath,
      method: 'post',
      data: { id: user.id, code },
      isServer: false,
      updateAuth,
    })

    if (result.error) setErr(result)
    else {
      clearErrState()
      setStateUser(result)
      setModal({ isShow: true, text: 'Two factor verification was enabled...' })
    }
  }

  const disableTwoFa = async () => {
    const result = await apiService({
      url: `${getApiUserUpdatePath(user.id)}`,
      method: 'patch',
      data: { isTwoFa: false, twoFaHash: null },
      isServer: false,
      updateAuth
    })

    if (result.error) setErr(result)
    else {
      clearErrState()
      setStateUser(result)
      setModal({ isShow: true, text: 'Two factor verification was disabled...' })
    }
  }

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Settings',
      children: user.firstName && <Settings user={user} onSubmit={onSubmit} />
    },
    {
      key: '2',
      label: 'Password',
      children: <Password form={form} updatePassword={updatePassword} />
    },
    {
      key: '3',
      label: 'Two Factor Verification',
      children: (
        <TwoFa
          isTwoFa={user.isTwoFa}
          enableTwoFa={
            async () => await apiService({ url: `${getApiTwoFaPath(user.id)}`, method: 'get', isServer: false, updateAuth })
          }
          disableTwoFa={disableTwoFa}
          confirmTwoFa={confirmTwoFa}
        />
      )
    }
  ]

  return (
    <div className='w-90-percent m-auto'>
      <Tabs defaultActiveKey='1' items={tabItems} />
      <Error error={err}/>
      {modal.isShow && <Alert message={modal.text} type="success" showIcon />}
    </div>
  )
}

export default withAuth(Profile)
