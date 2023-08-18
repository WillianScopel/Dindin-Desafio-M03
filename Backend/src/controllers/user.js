const knex = require('../connection')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const secretPassword = require('../passwordToken')
const { number } = require('joi')

const createUser = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const userAlreadyExist = await knex('usuarios').where({ email: email }).returning('*').first()

        if (userAlreadyExist) {
            return res.status(400).json({ mensagem: "O email informado já está cadastrado" })
        }

        const encriptedPassword = await bcrypt.hash(senha, 10)

        const newUser = await knex('usuarios').insert({
            nome,
            email,
            senha: encriptedPassword,
        }).returning('*')


        const { senha: _, ...user } = newUser[0]

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
        const user = await knex('usuarios').where({ email: email }).first()
        console.log(user);
        if (!user) {
            return res.status(400).json({ mensagem: "E-mail ou senha incorretos." })
        }

        const validPassword = await bcrypt.compare(senha, user.senha)

        if (!validPassword) {
            return res.status(400).json({ mensagem: "Email ou senha invalidos" })
        }

        const token = jwt.sign({ id: user.id }, secretPassword, { expiresIn: '8h' })
        const { senha: _, ...userData } = user

        return res.status(200).json({
            user: userData,
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
    const userData = req.user

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' })
        }

        const emailExist = await knex('usuarios').where({ email: email }).first()

        if (emailExist && emailExist.email != userData.email) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' })
        }

        const hashPassword = await bcrypt.hash(senha.toString(), 10)
        const updateUser = await knex('usuarios').where({ id: userData.id }).update({
            nome,
            email,
            senha: hashPassword
        })

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