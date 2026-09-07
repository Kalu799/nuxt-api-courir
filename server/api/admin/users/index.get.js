import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    const [users] = await connection.query(`
      SELECT
        u.id,
        u.login,
        u.role,
        u.current_session_id AS currentSessionId,
        u.photo_url AS photoUrl,
        u.created_at AS createdAt,

        s.label AS currentSessionLabel,
        sem.numero AS currentWeekNumber,
        sai.label AS currentSeasonLabel

      FROM LU_users u

      LEFT JOIN LU_sessions s
        ON s.id = u.current_session_id

      LEFT JOIN LU_semaines sem
        ON sem.id = s.semaine_id

      LEFT JOIN LU_saisons sai
        ON sai.id = sem.saison_id

      ORDER BY u.id ASC
    `)

    return users
  }
  finally {
    await connection.end()
  }
})