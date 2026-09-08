import mysql from 'mysql2/promise'
import { hasDuplicateOrder, isPositiveInteger } from '../../../utils/program-validation.js'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const semaineId = body.semaineId?.trim()
  const label = body.label?.trim()
  const ordre = Number(body.ordre)
  const newId = `${semaineId}-jour${ordre}`

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
      ignoredId: id,
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Une session utilise déjà cet ordre dans cette semaine',
      })
    }

    const [result] = await connection.query(
      `
        UPDATE LU_sessions
        SET id = ?, semaine_id = ?, label = ?, ordre = ?
        WHERE id = ?
      `,
      [newId, semaineId, label, ordre, id]
    )

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Session introuvable',
      })
    }

    return {
      id: newId,
      semaineId,
      label,
      ordre,
    }
  }
  finally {
    await connection.end()
  }
})
