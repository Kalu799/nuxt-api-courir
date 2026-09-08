export const useAdminAuth = () => {
  const token = useCookie('adminToken')
  const user = useState('adminUser', () => null)

  const isAuthenticated = computed(() => {
    return !!token.value
  })

  const login = async (login, password) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        login,
        password,
      },
    })

    if (data.user.role !== 'admin') {
      throw new Error('Accès administrateur requis')
    }

    token.value = data.token
    user.value = data.user

    return data.user
  }

  const logout = () => {
    token.value = null
    user.value = null
  }

  const fetchMe = async () => {
    if (!token.value) {
      return null
    }

    try {
      const data = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (data.role !== 'admin') {
        logout()
        return null
      }

      user.value = data

      return data
    }
    catch {
      logout()
      return null
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchMe,
  }
}