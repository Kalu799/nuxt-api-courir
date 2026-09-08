import mysql from 'mysql2/promise'
import { hasDuplicateOrder, isPositiveInteger } from '../../../utils/program-validation.js'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  const id = body.id?.trim()
  const saisonId = body.saisonId?.trim()
  const numero = Number(body.numero)

  if (!id || !saisonId || !isPositiveInteger(numero)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'id, saisonId et numero entier positif sont requis',
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
      scope: 'week',
      parentId: saisonId,
      order: numero,
    })

    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cette semaine existe déjà dans cette saison',
      })
    }

    await connection.query(
      `
        INSERT INTO LU_semaines (
          id,
          saison_id,
          numero
        )
        VALUES (?, ?, ?)
      `,
      [id, saisonId, numero]
    )

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
