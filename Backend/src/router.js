const express = require('express')
const { createUser,
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
} = require('./controllers/user')

const { authorization } = require('./middlewares/authorization')

const router = express()

router.post('/usuario', createUser)
router.post('/login', userLogin)


router.use(authorization)

router.get('/usuario', identifyUser)
router.put('/usuario', updateUser)
router.get('/categoria', listCategories)
router.get('/transacao', listTransactions)
router.post('/transacao', registerTransaction)
router.get('/transacao/extrato', getExtract)
router.get('/transacao/:id', detailTransaction)
router.put('/transacao/:id', updateTransaction)
router.delete('/transacao/:id', deleteTransaction)

module.exports = router