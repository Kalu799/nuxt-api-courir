import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const saisonId = body.saisonId?.trim()
  const numero = Number(body.numero)

  if (!saisonId || !numero) {
    throw createError({
      statusCode: 400,
      statusMessage: 'saisonId et numero sont requis',
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
        UPDATE LU_semaines
        SET saison_id = ?, numero = ?
        WHERE id = ?
      `,
      [saisonId, numero, id]
    )

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Semaine introuvable',
      })
    }

    return {
      id,
      saisonId,
      numero,
    }
  }
  finally {
    await connection.end()
  }
})