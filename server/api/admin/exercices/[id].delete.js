import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')

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
        DELETE FROM LU_exercices
        WHERE id = ?
      `,
      [id]
    )

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Exercice introuvable',
      })
    }

    return {
      message: 'Exercice supprimé',
    }
  }
  finally {
    await connection.end()
  }
})