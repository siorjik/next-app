import { Fragment, useEffect, useState } from 'react'
import { Alert, Row, Col } from "antd"
import { useRouter } from 'next/router'

import { loginAppPath } from '@/utils/paths'
import { ApiErrorType } from '@/types/errorType'

const Error = (
  { error, className = '', respWidth }:
  { error: ApiErrorType, className?: string, respWidth?: {[k:string]: number } }
) => {
  const [isShow, setShow] = useState(false)
  const { replace, pathname } = useRouter()

  const { statusCode, message: errMess } = error

  useEffect(() => {
    if (errMess) setShow(true)
    else setShow(false)
  }, [errMess])

  if (statusCode && statusCode === 401 && pathname !== loginAppPath) replace('/error?signOut=true&isClient=true')

  const widthObj = respWidth || { xs: 24, md: 16, lg: 12 }

  const alert = (
    <Row>
      <Col {...widthObj}>
        {
          errMess.length && Array.isArray(errMess) ?
            errMess.map((item, index) =>
              <Fragment key={index}>
                <Alert className={`error ${className}`} type='error' message={item} banner closable />
              </Fragment>) :
            typeof errMess === 'string' ?
              <Alert className={`error ${className}`} type='error' message={errMess} banner closable /> : null
        }
      </Col>
    </Row>
  )

  return <>{isShow ? alert : null}</>
}

export default Error
