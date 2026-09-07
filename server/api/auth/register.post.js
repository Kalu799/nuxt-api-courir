import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const login = body.login?.trim()
  const password = body.password

  if (!login || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Login et mot de passe requis',
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le mot de passe doit contenir au moins 6 caractères',
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
    const [existingUsers] = await connection.query(
      `
        SELECT id
        FROM LU_users
        WHERE login = ?
        LIMIT 1
      `,
      [login]
    )

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Ce login existe déjà',
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await connection.query(
      `
        INSERT INTO LU_users (
          login,
          password_hash,
          role
        )
        VALUES (?, ?, 'user')
      `,
      [login, passwordHash]
    )

    return {
      id: result.insertId,
      login,
      role: 'user',
    }
  }
  finally {
    await connection.end()
  }
})