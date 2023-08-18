const knex = require('../connection')


const listCategories = async (req, res) => {
    try {
        const allCategories = await knex('categorias')

        return res.status(200).json(allCategories)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = { listCategories }