const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost ou host onde o DB está hospedado',
    port: 5432,
    user: 'seu-usuario',
    password: 'senha do DB',
    database: 'dindin',
})

module.exports = pool