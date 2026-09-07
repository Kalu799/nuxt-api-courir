import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  const [rows] = await connection.query('SELECT 1 AS ok')

  await connection.end()

  return rows[0]
})