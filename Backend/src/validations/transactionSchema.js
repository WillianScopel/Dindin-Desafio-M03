const joi = require('joi')

const transactionSchema = joi.object({
    descricao: joi.string().required().max(40).messages({
        'any.required': 'O campo descrição é obrigatório',
        'string.empty': 'O campo descrição é obrigatório',
        'string.max': 'O campo descrição pode conter no máximo 40 caracteres',
        'string.base': 'O campo descrição não deve conter apenas números'
    }),

    valor: joi.string().required().messages({
        'any.required': 'O campo valor é obrigatório',
        'string.empty': 'O campo valor é obrigatório',
        'string.max': 'O campo valor pode conter no máximo 10 caracteres',
    }),

    data: joi.date().required().messages({
        'any.required': 'O campo Data é obrigatório',
        'date.base': 'O campo data precisa ser uma data válida'
    }),
    categoria_id: joi.number().required().messages({
        'any.required': 'O campo Categoria é obrigatório',
    }),
    tipo: joi.string().required().messages({
        'any.required': 'Escolha se o tipo de transação é de Entrada ou Saída',
    }),
})


module.exports = transactionSchema