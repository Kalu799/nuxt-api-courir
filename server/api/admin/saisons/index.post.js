import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  const id = body.id?.trim()
  const label = body.label?.trim()
  const slug = body.slug?.trim()

  if (!id || !label || !slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id, label et slug sont requis',
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
    const [existing] = await connection.query(
      `
        SELECT id
        FROM LU_saisons
        WHERE id = ? OR slug = ?
        LIMIT 1
      `,
      [id, slug]
    )

    if (existing.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cette saison existe déjà',
      })
    }

    await connection.query(
      `
        INSERT INTO LU_saisons (
          id,
          label,
          slug
        )
        VALUES (?, ?, ?)
      `,
      [id, label, slug]
    )

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