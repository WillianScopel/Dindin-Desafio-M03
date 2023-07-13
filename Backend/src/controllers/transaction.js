const pool = require('../connection')
const valueInCents = require('../utils/utils')

const listTransactions = async (req, res) => {
    const { id } = req.user

    try {
        const query = 'SELECT t.id, t.tipo, t."descriçao", t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao AS categoria_nome FROM transacoes AS t JOIN categorias AS c ON t.categoria_id = c.id WHERE t.usuario_id = $1'
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
        const registredTransaction = await pool.query(registredTransactionQuery, [descricao, valueInCents(valor), data, categoria_id, id, tipo])

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

        const insertQueryToVerify = 'SELECT * FROM transacoes AS t LEFT JOIN usuarios AS u ON t.usuario_id = u.id WHERE u.id = $1 AND t.id = $2'
        const { rowCount } = await pool.query(insertQueryToVerify, [idUser, idTransaction])

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

        const insertQuery = 'SELECT * FROM transacoes AS t LEFT JOIN usuarios AS u ON t.usuario_id = u.id WHERE u.id = $1 AND t.id = $2'
        const { rowCount } = await pool.query(insertQuery, [idUser, idTransaction])

        if (rowCount <= 0) {
            return res.status(400).json({ mensagem: 'Transação não pertence ao usuário informado' })
        }

        const newTransactionDelete = await pool.query('DELETE FROM transacoes WHERE id = $1', [idTransaction])

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const getExtract = async (req, res) => {
    const usuario_id = req.user.id

    try {
        const extractEntryQuery = `SELECT SUM(valor) FROM transacoes as t WHERE t.tipo = $1 AND t.usuario_id = $2 `
        const extractSumEntry = await pool.query(extractEntryQuery, ["entrada", usuario_id])
        const extractExitQuery = `SELECT SUM(valor) FROM transacoes as t WHERE t.tipo = $1 AND t.usuario_id = $2`
        const extractSumExit = await pool.query(extractExitQuery, ["saida", usuario_id])

        const response = {
            entrada: extractSumEntry.rows[0].sum || 0,
            saida: extractSumExit.rows[0].sum || 0
        }

        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json(error.message)
    }

}

module.exports = {
    listTransactions,
    registerTransaction,
    detailTransaction,
    updateTransaction,
    deleteTransaction,
    getExtract
}