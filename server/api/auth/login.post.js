import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    // Seuls les champs nécessaires à la connexion sont lus. Le hash ne quitte
    // jamais le serveur et n'est utilisé que pour la comparaison bcrypt.
    const [users] = await connection.query(
      `
        SELECT
          id,
          login,
          password_hash,
          role,
          current_session_id,
          photo_url
        FROM LU_users
        WHERE login = ?
        LIMIT 1
      `,
      [login]
    )

    if (users.length === 0) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants incorrects',
      })
    }

    const user = users[0]

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Identifiants incorrects',
      })
    }

    // Le jeton porte les informations minimales nécessaires aux routes protégées
    // et expire afin de ne pas laisser une session valide indéfiniment.
    const token = jwt.sign(
      {
        id: user.id,
        login: user.login,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    )

    return {
      token,
      user: {
        id: user.id,
        login: user.login,
        role: user.role,
        currentSessionId: user.current_session_id,
        photoUrl: user.photo_url,
      },
    }
  }
  finally {
    await connection.end()
  }
})
