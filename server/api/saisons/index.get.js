import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    // La base est relationnelle, alors que l'application consomme une structure
    // saison > semaines > séances > exercices. Les lectures sont ordonnées avant
    // l'assemblage pour conserver l'ordre pédagogique défini dans le CMS.
    const [saisons] = await connection.query(`
      SELECT *
      FROM LU_saisons
    `)

    const [semaines] = await connection.query(`
      SELECT *
      FROM LU_semaines
      ORDER BY numero ASC
    `)

    const [sessions] = await connection.query(`
      SELECT *
      FROM LU_sessions
      ORDER BY ordre ASC
    `)

    const [exercices] = await connection.query(`
      SELECT
        id,
        session_id,
        type,
        duree_minutes AS dureeMinutes,
        ordre
      FROM LU_exercices
      ORDER BY ordre ASC
    `)

    // L'assemblage est réalisé sur des données déjà lues : il ne déclenche pas
    // de requête SQL supplémentaire à l'intérieur des boucles.
    for (const session of sessions) {
      session.exercices = exercices.filter(
        exercice => exercice.session_id === session.id
      )
    }

    for (const semaine of semaines) {
      semaine.jours = sessions.filter(
        session => session.semaine_id === semaine.id
      )
    }

    for (const saison of saisons) {
      saison.semaines = semaines.filter(
        semaine => semaine.saison_id === saison.id
      )
    }

    return saisons
  }
  finally {
    await connection.end()
  }
})
