import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  const id = body.id?.trim()
  const semaineId = body.semaineId?.trim()
  const label = body.label?.trim()
  const ordre = Number(body.ordre)

  if (!id || !semaineId || !label || !ordre) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id, semaineId, label et ordre sont requis',
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
    await connection.query(
      `
        INSERT INTO LU_sessions (
          id,
          semaine_id,
          label,
          ordre
        )
        VALUES (?, ?, ?, ?)
      `,
      [id, semaineId, label, ordre]
    )

    return {
      id,
      semaineId,
      label,
      ordre,
    }
  }
  finally {
    await connection.end()
  }
})