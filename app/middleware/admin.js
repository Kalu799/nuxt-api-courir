export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') {
    return
  }

  const auth = useAdminAuth()

  if (!auth.token.value) {
    return navigateTo('/login')
  }

  if (!auth.user.value) {
    const user = await auth.fetchMe()

    if (!user) {
      return navigateTo('/login')
    }
  }
})