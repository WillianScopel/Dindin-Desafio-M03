const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'wans1106',
        database: 'dindin',
    }
})

module.exports = knex