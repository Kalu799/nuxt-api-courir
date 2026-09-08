import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  try {
    // Cette variante limite toutes les requêtes à la saison demandée, utile pour
    // les consommateurs qui n'ont pas besoin du catalogue complet.
    const [saisons] = await connection.query(
      `
        SELECT *
        FROM LU_saisons
        WHERE id = ?
        LIMIT 1
      `,
      [id]
    )

    if (saisons.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Saison introuvable',
      })
    }

    const saison = saisons[0]

    const [semaines] = await connection.query(
      `
        SELECT *
        FROM LU_semaines
        WHERE saison_id = ?
        ORDER BY numero ASC
      `,
      [id]
    )

    const [sessions] = await connection.query(
      `
        SELECT s.*
        FROM LU_sessions s
        INNER JOIN LU_semaines sem ON sem.id = s.semaine_id
        WHERE sem.saison_id = ?
        ORDER BY s.ordre ASC
      `,
      [id]
    )

    const [exercices] = await connection.query(
      `
        SELECT
          e.id,
          e.session_id,
          e.type,
          e.duree_minutes AS dureeMinutes,
          e.ordre
        FROM LU_exercices e
        INNER JOIN LU_sessions s ON s.id = e.session_id
        INNER JOIN LU_semaines sem ON sem.id = s.semaine_id
        WHERE sem.saison_id = ?
        ORDER BY e.ordre ASC
      `,
      [id]
    )

    // Même format de réponse que /api/saisons : le front ne dépend pas du schéma
    // relationnel MySQL et peut parcourir directement les niveaux du programme.
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

    saison.semaines = semaines

    return saison
  }
  finally {
    await connection.end()
  }
})
