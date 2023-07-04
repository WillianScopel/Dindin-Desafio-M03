const pool = require('../connection')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const secretPassword = require('../passwordToken')

const createUser = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
        }

        const query = "SELECT * FROM usuarios WHERE email = $1"
        const { rowCount } = await pool.query(query, [email])

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: "Usuário já está cadastrado" })
        }

        const hashPassword = await bcrypt.hash(senha.toString(), 10)
        const insertQuery = "INSERT INTO usuarios (nome, email, senha) VALUES($1, $2, $3) RETURNING *"
        const createdUser = await pool.query(insertQuery, [nome, email, hashPassword])

        if (createdUser.rowCount <= 0) {
            return res.status(400).json({ mensagem: "Criação do usuário falhou" })
        }

        const { senha: _, ...user } = createdUser.rows[0]

        return res.status(201).json(user)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const userLogin = async (req, res) => {
    const { email, senha } = req.body

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha obrigatorios." })
    }

    try {
        const loginQuery = "SELECT * FROM usuarios WHERE email = $1"
        const user = await pool.query(loginQuery, [email])

        if (user.rowCount <= 0) {
            return res.status(400).json({ mensagem: "Email ou senha invalidos" })
        }

        const validPassword = await bcrypt.compare(senha, user.rows[0].senha)

        if (!validPassword) {
            return res.status(400).json({ mensagem: "Email ou senha invalidos" })
        }

        const token = jwt.sign({ id: user.rows[0].id }, secretPassword, { expiresIn: '8h' })
        const { senha: _, ...registredUser } = user.rows[0]

        return res.status(200).json({
            user: registredUser,
            token
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const identifyUser = async (req, res) => {
    const user = req.user

    if (!user) {
        return res.status(404).json({ mensagem: 'Usuário não identificado' })
    }

    return res.status(200).json(user)
}

const updateUser = async (req, res) => {
    const { nome, email, senha } = req.body
    const { id } = req.user

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
        }

        const { rowCount } = await pool.query('SELECT email FROM usuarios WHERE email = $1 AND id != $2', [email, Number(id)])

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' })
        }

        const hashPassword = await bcrypt.hash(senha.toString(), 10)
        const insertQuery = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4'
        const insertData = [nome, email, hashPassword, id]
        const newUpdateUser = await pool.query(insertQuery, insertData)

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = {
    createUser,
    userLogin,
    identifyUser,
    updateUser
}