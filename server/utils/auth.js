import jwt from 'jsonwebtoken'

export const getAuthenticatedUser = (event) => {
  // Chaque requête protégée vérifie le jeton : aucune donnée utilisateur n'est
  // déduite d'un identifiant transmis par le navigateur.
  const authorization = getHeader(event, 'authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant',
    })
  }

  const token = authorization.slice(7)

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
  catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide ou expiré',
    })
  }
}

export const requireAdmin = (event) => {
  const user = getAuthenticatedUser(event)

  // Le middleware de l'interface améliore l'expérience, mais ce contrôle
  // serveur reste indispensable puisqu'une route API peut être appelée directement.
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès administrateur requis',
    })
  }

  return user
}
