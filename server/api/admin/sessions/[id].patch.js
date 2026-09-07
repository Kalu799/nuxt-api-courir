import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const semaineId = body.semaineId?.trim()
  const label = body.label?.trim()
  const ordre = Number(body.ordre)

  if (!semaineId || !label || !ordre) {
    throw createError({
      statusCode: 400,
      statusMessage: 'semaineId, label et ordre sont requis',
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
        UPDATE LU_sessions
        SET semaine_id = ?, label = ?, ordre = ?
        WHERE id = ?
      `,
      [semaineId, label, ordre, id]
    )

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Session introuvable',
      })
    }

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