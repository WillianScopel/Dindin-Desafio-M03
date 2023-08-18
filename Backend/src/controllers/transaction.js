const knex = require('../connection')
const valueInCents = require('../utils/utils')

const listTransactions = async (req, res) => {
    const { id } = req.user

    try {
        const transactions = await knex.select(
            't.id',
            't.tipo',
            't.descriçao as descrição',
            't.valor',
            't.data',
            't.usuario_id',
            't.categoria_id',
            'c.descricao as categoria_nome'
        )
            .from('transacoes as t')
            .join('categorias as c', 't.categoria_id', 'c.id')
            .where('t.usuario_id', id)

        return res.status(200).json(transactions)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const registerTransaction = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body
    const { id } = req.user

    try {
        const categoryID = await knex('categorias').where({ id: categoria_id }).first()

        if (!categoryID) {
            return res.status(400).json({ mensagem: "Não existe categoria com o ID informado" })
        }

        if (tipo != 'entrada' & tipo != 'saida') {
            return res.status(400).json({ mensagem: "Ocorreu algum erro com o campo 'Tipo'" })
        }

        const registredTransaction = await knex('transacoes').insert({
            descriçao: descricao,
            valor: valueInCents(valor),
            data,
            categoria_id,
            usuario_id: id,
            tipo
        }).returning('*')

        const response = {
            ...registredTransaction[0],
            categoria_id: categoryID.id,
            categoria_nome: categoryID.descricao
        }

        return res.status(201).json(response)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const detailTransaction = async (req, res) => {
    const { id } = req.params
    const id_usuario = req.user.id

    try {
        const detailsTransaction = await knex.select('t.id',
            't.descriçao',
            't.valor',
            't.data',
            't.tipo',
            't.usuario_id',
            't.categoria_id',
            'c.descricao as categoria_nome',
        )
            .from('transacoes as t')
            .rightJoin('categorias as c', 'c.id', 't.categoria_id')
            .where('t.id', id)
            .andWhere('t.usuario_id', id_usuario).first()

        if (!detailsTransaction) {
            return res.status(400).json({ mensagem: 'Transação não encontrada.' })
        }

        return res.status(200).json(detailsTransaction)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const updateTransaction = async (req, res) => {
    const { id: transactionId } = req.params
    const { id: userId } = req.user
    const { descricao, valor, data, categoria_id, tipo } = req.body

    if (!transactionId) {
        return res.status(404).json({ mensagem: 'Transação não encontrada' })
    }

    try {
        const transactionToUpdate = await knex.select('*')
            .from('transacoes as t')
            .leftJoin('usuarios as u', 't.usuario_id', 'u.id')
            .where('u.id', userId)
            .andWhere('t.id', transactionId)
            .first()

        if (!transactionToUpdate) {
            return res.status(400).json({ mensagem: 'Transação não pertence ao usuário informado' })
        }

        await knex('transacoes')
            .update({
                descriçao: descricao,
                valor: valueInCents(valor),
                data,
                categoria_id,
                tipo
            })
            .where('id', transactionId)

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const deleteTransaction = async (req, res) => {
    const { id: transactionId } = req.params
    const { id: userId } = req.user

    if (!transactionId) {
        return res.status(404).json({ mensagem: 'Transação não encontrada' })
    }

    try {
        const transactionToDelete = await knex.select('*')
            .from('transacoes as t')
            .leftJoin('usuarios as u', 't.usuario_id', 'u.id')
            .where('u.id', userId)
            .andWhere('t.id', transactionId).returning('*').first()

        if (!transactionToDelete) {
            return res.status(400).json({ mensagem: 'Transação não pertence ao usuário informado' })
        }

        await knex('transacoes')
            .delete()
            .where({ id: transactionId })

        return res.status(204).json()

    } catch (error) {
        return res.status(500).json(error.message)
    }

}

const getExtract = async (req, res) => {
    const userId = req.user.id

    try {

        const extractEntry = await knex('transacoes as t')
            .sum('valor as entrada')
            .where('t.tipo', 'entrada')
            .andWhere('t.usuario_id', userId).first()
        const extractExit = await knex('transacoes as t')
            .sum('valor as saida')
            .where('t.tipo', 'saida')
            .andWhere('t.usuario_id', userId).first()

        const response = {
            entrada: extractEntry.entrada || 0,
            saida: extractExit.saida || 0
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