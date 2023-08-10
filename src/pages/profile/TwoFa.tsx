import { useEffect, useState } from 'react'
import { Button, QRCode, Row, Col } from 'antd'

import TwoFaComp from '../../components/TwoFa'

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
            <TwoFaComp onSubmit={async (code: string) => await confirmTwoFa(code)} />
          </Col>
        </Row>
      }
    </>
  )
}

export default TwoFa
