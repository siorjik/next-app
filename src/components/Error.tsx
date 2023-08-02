import { Fragment } from 'react'
import { Alert, Row, Col } from "antd"
import { useRouter } from 'next/router'

import { loginAppPath } from '@/utils/paths'
import { ApiErrorType } from '@/types/errorType'

const Error = ({ error, className = '' }: { error: ApiErrorType, className?: string }) => {
  const { statusCode, message: errMess } = error
  const { replace, pathname } = useRouter()

  if (statusCode && statusCode === 401 && pathname !== loginAppPath) replace('/error?signOut=true')

  return (
    <Row>
      <Col xs={24} md={16} lg={12}>
        {
          errMess.length && Array.isArray(errMess) ?
            errMess.map((item, index) =>
              <Fragment key={index}><Alert className={`error ${className}`} type='error' message={item} banner closable /></Fragment>) :
            typeof errMess === 'string' ? <Alert className={`error ${className}`} type='error' message={errMess} banner closable /> : null
        }
      </Col>
    </Row>
  )
}

export default Error
