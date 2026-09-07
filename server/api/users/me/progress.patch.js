import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const user = getAuthenticatedUser(event)
  const body = await readBody(event)

  const currentSessionId = body.currentSessionId ?? null

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    if (currentSessionId !== null) {
      const [sessions] = await connection.query(
        `
          SELECT id
          FROM LU_sessions
          WHERE id = ?
          LIMIT 1
        `,
        [currentSessionId]
      )

      if (sessions.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Session introuvable',
        })
      }
    }

    await connection.query(
      `
        UPDATE LU_users
        SET current_session_id = ?
        WHERE id = ?
      `,
      [currentSessionId, user.id]
    )

    return {
      currentSessionId,
    }
  }
  finally {
    await connection.end()
  }
})