export const EXERCISE_TYPES = [
  'echauffement',
  'trotte',
  'marche',
  'etirement',
  'sprint',
  'deboule',
  'cours',
]

// Chaque niveau éditable possède un ordre unique dans son parent. Centraliser
// les tables et colonnes évite que les routes POST et PATCH divergent.
const orderScopes = {
  week: {
    table: 'LU_semaines',
    parentColumn: 'saison_id',
    orderColumn: 'numero',
  },
  session: {
    table: 'LU_sessions',
    parentColumn: 'semaine_id',
    orderColumn: 'ordre',
  },
  exercise: {
    table: 'LU_exercices',
    parentColumn: 'session_id',
    orderColumn: 'ordre',
  },
}

export const isPositiveInteger = (value) => {
  return Number.isInteger(value) && value >= 1
}

export const isPositiveNumber = (value) => {
  return Number.isFinite(value) && value > 0
}

export const isExerciseType = (value) => {
  return EXERCISE_TYPES.includes(value)
}

export const hasDuplicateOrder = async (
  connection,
  { scope, parentId, order, ignoredId = null }
) => {
  const config = orderScopes[scope]

  if (!config) {
    throw new Error('Portée d’ordre inconnue')
  }

  const ignoredCondition = ignoredId === null ? '' : ' AND id <> ?'
  const values = ignoredId === null
    ? [parentId, order]
    : [parentId, order, ignoredId]

  const [rows] = await connection.query(
    `
      SELECT id
      FROM ${config.table}
      WHERE ${config.parentColumn} = ? AND ${config.orderColumn} = ?${ignoredCondition}
      LIMIT 1
    `,
    values
  )

  return rows.length > 0
}
