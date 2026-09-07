import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  const [saisons] = await connection.query(`
    SELECT *
    FROM LU_saisons
  `)

  for (const saison of saisons) {
    const [semaines] = await connection.query(`
      SELECT *
      FROM LU_semaines
      WHERE saison_id = ?
      ORDER BY numero ASC
    `, [saison.id])

    for (const semaine of semaines) {
      const [sessions] = await connection.query(`
        SELECT *
        FROM LU_sessions
        WHERE semaine_id = ?
        ORDER BY ordre ASC
      `, [semaine.id])

      for (const session of sessions) {
        const [exercices] = await connection.query(`
          SELECT
          id,
          session_id,
          type,
          duree_minutes AS dureeMinutes,
          ordre
          FROM LU_exercices
          WHERE session_id = ?
          ORDER BY ordre ASC
        `, [session.id])

        session.exercices = exercices
      }

      semaine.jours = sessions
    }

    saison.semaines = semaines
  }

  await connection.end()

  return saisons
})