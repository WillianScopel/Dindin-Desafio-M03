const express = require('express')
const { createUser, userLogin, identifyUser, updateUser } = require('./controllers/user')
const { listTransactions, registerTransaction, getExtract, detailTransaction, updateTransaction, deleteTransaction } = require('./controllers/transaction')
const { listCategories } = require('./controllers/categories')
const { authorization } = require('./middlewares/authorization')
const validateBodyrequisition = require('./middlewares/bodyRequisition')
const userSchema = require('./validations/userSchema')
const transactionSchema = require('./validations/transactionSchema')
const router = express()

router.post('/usuario', validateBodyrequisition(userSchema), createUser)
router.post('/login', userLogin)


router.use(authorization)

router.get('/usuario', identifyUser)
router.put('/usuario', updateUser)
router.get('/categoria', listCategories)
router.get('/transacao', listTransactions)
router.post('/transacao', validateBodyrequisition(transactionSchema), registerTransaction)
router.get('/transacao/extrato', getExtract)
router.get('/transacao/:id', detailTransaction)
router.put('/transacao/:id', validateBodyrequisition(transactionSchema), updateTransaction)
router.delete('/transacao/:id', deleteTransaction)

module.exports = router