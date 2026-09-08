import mysql from 'mysql2/promise'
import { hasDuplicateOrder, isPositiveInteger } from '../../../utils/program-validation.js'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  const semaineId = body.semaineId?.trim()
  const label = body.label?.trim()
  const ordre = Number(body.ordre)
  const id = `${semaineId}-jour${ordre}`

  if (!semaineId || !label || !isPositiveInteger(ordre)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'semaineId, label et ordre entier positif sont requis',
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
    const existing = await hasDuplicateOrder(connection, {
      scope: 'session',
      parentId: semaineId,
      order: ordre,
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Une session utilise déjà cet ordre dans cette semaine',
      })
    }

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
