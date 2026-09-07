import mysql from 'mysql2/promise'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const authorization = getHeader(event, 'authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token manquant',
    })
  }

  const token = authorization.slice(7)

  let decoded

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  }
  catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token invalide ou expiré',
    })
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    const [users] = await connection.query(
      `
        SELECT
          id,
          login,
          role,
          current_session_id,
          photo_url
        FROM LU_users
        WHERE id = ?
        LIMIT 1
      `,
      [decoded.id]
    )

    if (users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Utilisateur introuvable',
      })
    }

    const user = users[0]

    return {
      id: user.id,
      login: user.login,
      role: user.role,
      currentSessionId: user.current_session_id,
      photoUrl: user.photo_url,
    }
  }
  finally {
    await connection.end()
  }
})