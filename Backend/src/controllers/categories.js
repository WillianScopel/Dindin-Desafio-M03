const pool = require('../connection')


const listCategories = async (req, res) => {
    try {
        const { rows: allCategories } = await pool.query('SELECT * FROM categorias')

        return res.status(200).json(allCategories)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = { listCategories }