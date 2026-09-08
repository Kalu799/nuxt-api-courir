import mysql from 'mysql2/promise'
import { hasDuplicateOrder, isExerciseType, isPositiveInteger, isPositiveNumber } from '../../../utils/program-validation.js'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const sessionId = body.sessionId?.trim()
  const type = body.type?.trim()
  const dureeMinutes = Number(body.dureeMinutes)
  const ordre = Number(body.ordre)

  if (
    !sessionId
    || !isExerciseType(type)
    || !isPositiveNumber(dureeMinutes)
    || !isPositiveInteger(ordre)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'sessionId, type valide, dureeMinutes et ordre entier positif sont requis',
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
      scope: 'exercise',
      parentId: sessionId,
      order: ordre,
      ignoredId: id,
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Un exercice utilise déjà cet ordre dans cette session',
      })
    }

    const [result] = await connection.query(
      `
        UPDATE LU_exercices
        SET session_id = ?, type = ?, duree_minutes = ?, ordre = ?
        WHERE id = ?
      `,
      [sessionId, type, dureeMinutes, ordre, id]
    )

    if (result.affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Exercice introuvable',
      })
    }

    return {
      id,
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
