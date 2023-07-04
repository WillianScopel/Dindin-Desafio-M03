const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'wans1106',
    database: 'dindin',
})

module.exports = pool