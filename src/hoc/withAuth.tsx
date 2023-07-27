import { TokensType } from '@/types/tokenType'
import { useEffect } from 'react'

function withAuth<P>(WrappedComponent: React.ComponentType<P>) {
  const Component = (props: P & { tokens?: TokensType }) => {
    const { tokens } = props

    useEffect(() => {
      if (tokens) setTimeout(() => updateAuth(tokens), 500)
    }, [tokens])

    const updateAuth = async (tokens: TokensType) =>
      await fetch(`/api/auth/session?update&access=${tokens.accessToken}&refresh=${tokens.refreshToken}`)

    return <WrappedComponent {...props} updateAuth={updateAuth} />
  }

  return Component
}

export default withAuth
