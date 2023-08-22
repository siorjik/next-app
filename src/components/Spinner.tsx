import { Spin } from 'antd'

const Spinner = (
  { isLoading, size = 'large', styleName }: { isLoading?: boolean, size?: 'large' | 'small', styleName?: string }
) => {
  const spinner = <Spin tip={size === 'large' ? 'Loading' : null} size={size} />

  return (
    <>
      {
        isLoading || isLoading === undefined ?
          <div className={styleName ? `${styleName}` : 'spinner'}>{spinner}</div> : null
      }
    </>
  )
}

export default Spinner
