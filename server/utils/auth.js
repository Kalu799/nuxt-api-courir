import jwt from 'jsonwebtoken'

export const getAuthenticatedUser = (event) => {
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

  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès administrateur requis',
    })
  }

  return user
}