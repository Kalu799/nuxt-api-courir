import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const label = body.label?.trim()
  const slug = body.slug?.trim()

  if (!label || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'label et slug sont requis',
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
        UPDATE LU_saisons
        SET label = ?, slug = ?
        WHERE id = ?
      `,
      [label, slug, id]
    )

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Saison introuvable',
      })
    }

    return {
      id,
      label,
      slug,
    }
  }
  finally {
    await connection.end()
  }
})