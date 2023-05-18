export default async (cb: () => {}, name: string) => {
  try {
    const result = await cb()

    return {
      props: { [name]: result },
    }
  } catch (error) {
    return {
      redirect: {
        destination: error.response.status === 401 ? '/error?signOut=true' : '/error',
        permanent: false,
      },
    }
  }
}