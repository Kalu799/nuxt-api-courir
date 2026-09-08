import assert from 'node:assert/strict'
import test from 'node:test'

import {
  EXERCISE_TYPES,
  hasDuplicateOrder,
  isExerciseType,
  isPositiveInteger,
  isPositiveNumber,
} from '../server/utils/program-validation.js'

test('les types d’exercice autorisés sont limités au référentiel CMS', () => {
  assert.deepEqual(EXERCISE_TYPES, [
    'echauffement',
    'trotte',
    'marche',
    'etirement',
    'sprint',
    'deboule',
    'cours',
  ])

  assert.equal(isExerciseType('sprint'), true)
  assert.equal(isExerciseType('course'), false)
  assert.equal(isExerciseType(''), false)
})

test('un ordre doit être un entier positif', () => {
  assert.equal(isPositiveInteger(1), true)
  assert.equal(isPositiveInteger(12), true)
  assert.equal(isPositiveInteger(0), false)
  assert.equal(isPositiveInteger(-1), false)
  assert.equal(isPositiveInteger(1.5), false)
})

test('une durée doit être un nombre fini strictement positif', () => {
  assert.equal(isPositiveNumber(0.5), true)
  assert.equal(isPositiveNumber(30), true)
  assert.equal(isPositiveNumber(0), false)
  assert.equal(isPositiveNumber(-1), false)
  assert.equal(isPositiveNumber(Number.NaN), false)
  assert.equal(isPositiveNumber(Infinity), false)
})

test('la recherche de doublon cible le parent et l’ordre attendus', async () => {
  let statement = ''
  let parameters = []

  const connection = {
    query: async (sql, values) => {
      statement = sql
      parameters = values

      return [[{ id: 42 }]]
    },
  }

  const duplicate = await hasDuplicateOrder(connection, {
    scope: 'exercise',
    parentId: 'session-test',
    order: 2,
    ignoredId: 17,
  })

  assert.equal(duplicate, true)
  assert.match(statement, /FROM LU_exercices/)
  assert.match(statement, /session_id = \? AND ordre = \? AND id <> \?/)
  assert.deepEqual(parameters, ['session-test', 2, 17])
})

test('la recherche de doublon retourne faux en absence de résultat', async () => {
  const connection = {
    query: async () => [[]],
  }

  const duplicate = await hasDuplicateOrder(connection, {
    scope: 'session',
    parentId: 'semaine-test',
    order: 1,
  })

  assert.equal(duplicate, false)
})
