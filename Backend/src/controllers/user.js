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

const listCategories = async (req, res) => {
    try {
        const { rows: allCategories } = await pool.query('SELECT * FROM categorias')

        return res.status(200).json(allCategories)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const listTransactions = async (req, res) => {
    const { id } = req.user

    try {
        const query = 'SELECT t.id, t.tipo, t."descriçao", t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome FROM transacoes AS t JOIN categorias AS c ON t.categoria_id = c.id WHERE t.usuario_id = $1;'
        const { rows: allTransactionsUniqueUser } = await pool.query(query, [id])

        return res.status(200).json(allTransactionsUniqueUser)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const registerTransaction = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body
    const { id } = req.user

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }

    try {
        const categoryQuery = 'SELECT * FROM categorias WHERE id = $1'
        const categoryID = await pool.query(categoryQuery, [categoria_id])

        if (categoryID.rowCount <= 0) {
            return res.status(400).json({ mensagem: "Não existe categoria com o ID informado" })
        }

        if (tipo != 'entrada' & tipo != 'saida') {
            return res.status(400).json({ mensagem: "Ocorreu algum erro com campo 'Tipo'" })
        }

        const registredTransactionQuery = `INSERT INTO transacoes 
        (descriçao, valor, data, categoria_id, usuario_id, tipo) 
        VALUES($1, $2, $3, $4, $5, $6) RETURNING *`
        const registredTransaction = await pool.query(registredTransactionQuery, [descricao, valor, data, categoria_id, id, tipo])

        if (registredTransaction.rowCount <= 0) {
            return res.status(400).json({ mensagem: "Cadastro da transação falhou" })
        }

        const descricao_nome = categoryID.rows[0].descricao

        const response = registredTransaction.rows[0]
        response.categoria_nome = descricao_nome
        return res.status(201).json(response)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const detailTransaction = async (req, res) => {
    const { id } = req.params
    const id_usuario = req.user.id

    try {
        const detailTransactionQuery = `SELECT t.id, t."descriçao", t.valor, t.data, t.tipo, t.usuario_id, t.categoria_id, c.descricao 
        as categoria_nome FROM transacoes as t 
        RIGHT JOIN categorias as c ON c.id = t.categoria_id 
        WHERE t.id = $1 AND t.usuario_id = $2`

        const detailsTransaction = await pool.query(detailTransactionQuery, [id, id_usuario])

        if (detailsTransaction.rowCount <= 0) {
            return res.status(400).json({ mensagem: 'Transação não encontrada.' })
        }


        return res.status(200).json(detailsTransaction.rows[0])
    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const getExtract = async (req, res) => {
    const usuario_id = req.user.id

    try {
        const extractQueryEntry = `SELECT SUM(valor) FROM transacoes as t WHERE t.tipo = $1 AND t.usuario_id = $2 `
        const extractSumEntry = await pool.query(extractQueryEntry, ["entrada", usuario_id])
        const extractExitQuery = `SELECT SUM(valor) FROM transacoes as t WHERE t.tipo = $1 AND t.usuario_id = $2`
        const extractSumExit = await pool.query(extractExitQuery, ["saida", usuario_id])

        const response = {
            entrada: extractSumEntry.rows[0].sum,
            saida: extractSumExit.rows[0].sum
        }

        if (response.entrada === null) {
            response.entrada = 0
        }

        if (response.saida === null) {
            response.saida = 0
        }

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const updateTransaction = async (req, res) => {
    const { id: idTransaction } = req.params
    const { id: idUser } = req.user
    const { descricao, valor, data, categoria_id, tipo } = req.body

    if (!idTransaction) {
        return res.status(404).json({ mensagem: 'Transação não encontrada' })
    }

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos obrigatórios devem ser informados.' })
    }
    try {

        const insertQueryToVerify = 'SELECT * FROM transacoes AS t LEFT JOIN usuarios AS u ON t.usuario_id = u.id WHERE u.id = $1 AND t.id = $2;'
        const { rowCount } = await pool.query(insertQueryToVerify, [idUser, idTransaction]);

        if (rowCount <= 0) {
            return res.status(400).json({ mensagem: 'Transação não pertence ao usuário informado' })
        }

        const insertQueryToUpdate = 'UPDATE transacoes SET descriçao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6'
        const insertData = [descricao, valueInCents(valor), data, categoria_id, tipo, idTransaction]
        const newUpdateTransaction = await pool.query(insertQueryToUpdate, insertData)


        return res.status(204).json()

    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const deleteTransaction = async (req, res) => {
    const { id: idTransaction } = req.params
    const { id: idUser } = req.user

    if (!idTransaction) {
        return res.status(404).json({ mensagem: 'Transação não encontrada' })
    }

    try {

        const insertQuery = 'SELECT * FROM transacoes AS t LEFT JOIN usuarios AS u ON t.usuario_id = u.id WHERE u.id = $1 AND t.id = $2;'
        const { rowCount } = await pool.query(insertQuery, [idUser, idTransaction]);

        if (rowCount <= 0) {
            return res.status(400).json({ mensagem: 'Transação não pertence ao usuário informado' })
        }

        const newTransactionDelete = await pool.query('DELETE FROM transacoes WHERE id = $1', [idTransaction])

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const valueInCents = (value) => {
    let removeSimbols = value.split("R$", 2)[1];

    let removePoint = removeSimbols.replace(".", "");

    let replaceForPoint = removePoint.replace(",", ".");

    let valueConverted = parseInt(parseFloat(replaceForPoint) * 100);

    return valueConverted;
};

module.exports = {
    createUser,
    userLogin,
    identifyUser,
    updateUser,
    listCategories,
    listTransactions,
    registerTransaction,
    detailTransaction,
    getExtract,
    updateTransaction,
    deleteTransaction
}