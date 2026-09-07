import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  const sessionId = body.sessionId?.trim()
  const type = body.type?.trim()
  const dureeMinutes = Number(body.dureeMinutes)
  const ordre = Number(body.ordre)

  if (!sessionId || !type || dureeMinutes <= 0 || !ordre) {
    throw createError({
      statusCode: 400,
      statusMessage: 'sessionId, type, dureeMinutes et ordre sont requis',
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
    const [result] = await connection.query(
      `
        INSERT INTO LU_exercices (
          session_id,
          type,
          duree_minutes,
          ordre
        )
        VALUES (?, ?, ?, ?)
      `,
      [sessionId, type, dureeMinutes, ordre]
    )

    return {
      id: result.insertId,
      sessionId,
      type,
      dureeMinutes,
      ordre,
    }
  }
  finally {
    await connection.end()
  }
})