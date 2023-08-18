const knex = require("../connection")
const jwt = require("jsonwebtoken")
const secretPassword = require("../passwordToken")

const authorization = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "Não autorizado." })
    }

    try {
        const token = authorization.split(" ")[1]
        const { id } = jwt.verify(token, secretPassword)
        const user = await knex('usuarios').where({ id: id }).first()

        if (!user) {
            return res.status(401).json({ mensagem: "Nao autorizado." })
        }

        const { senha: _, ...userData } = user

        req.user = userData

        next()

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = {
    authorization
}