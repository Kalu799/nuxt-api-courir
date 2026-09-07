export default defineEventHandler((event) => {
  const admin = requireAdmin(event)

  return {
    message: 'Accès admin autorisé',
    user: admin,
  }
})