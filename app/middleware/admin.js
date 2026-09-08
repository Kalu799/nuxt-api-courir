export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') {
    return
  }

  const auth = useAdminAuth()

  // Éviter d'afficher brièvement une page protégée lorsque aucun jeton local
  // n'est présent. La validation définitive reste faite par l'API dans fetchMe.
  if (!auth.token.value) {
    return navigateTo('/login')
  }

  if (!auth.user.value) {
    // Après un rechargement, le jeton est restauré avant le profil : celui-ci
    // doit être vérifié avant d'autoriser la navigation vers le CMS.
    const user = await auth.fetchMe()

    if (!user) {
      return navigateTo('/login')
    }
  }
})
