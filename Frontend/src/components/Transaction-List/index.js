import './styles.css'
import EditIcon from '../../assets/edit-icon.svg'
import DeleteIcon from '../../assets/delete-icon.svg'
import { correctValue } from '../../utils/utils';
import { useState, useEffect } from 'react'
import api from '../../services/api';
import IconOrder from '../../assets/order.png'
import ModalAddEditTransaction from '../../components/Modal-Add-Edit-Transaction';

function TransactionList({ setTransacionsList, transactions, getWeekDay, correctDate, ascOrDesc, listCategories, setAscOrDesc, setExtract }) {
  const [showDeletePopUp, setShowDeletePopUp] = useState(0)
  const [showModalEditTransaction, setShowModalEditTransaction] = useState(false)
  const [transactionToEdit, setTransactionToEdit] = useState({
    valor: '',
    data: '',
    descricao: '',
    tipo: '',
    categoria_id: ''
  })

  function handleChangeAscOrDesc() {
    setAscOrDesc(!ascOrDesc)
  }

  function handleShowDeletePopUp(e, transacaoID) {
    e.stopPropagation();
    setShowDeletePopUp(transacaoID);
  }

  function handleNoDelete(e) {
    e.stopPropagation()
    setShowDeletePopUp(0)
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    const token = localStorage.getItem('token')
    try {
      const response = await api.delete(`/transacao/${id}`, { headers: { 'authorization': `Bearer ${token}` } });
      const responseTransaction = await api.get(`/transacao`, { headers: { 'authorization': `Bearer ${token}` } })
      setTransacionsList(responseTransaction.data)
      handleShowDeletePopUp(e);
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditTransaction(transactionData) {
    setTransactionToEdit({
      valor: transactionData.valor,
      data: transactionData.data,
      descricao: transactionData.descricao,
      tipo: transactionData.tipo,
      categoria_id: transactionData.categoria_id,
      id_transacao: transactionData.id_transacao
    })

    setShowModalEditTransaction(true)
  }


  return (
    <div className='box-transactions'>
      <div className='cabeçalho'>
        <div className='cabeçalho-linha'>
          <span
            onClick={() => handleChangeAscOrDesc()}
            className='margin-top-20px width-data'>Data
            <img
              src={IconOrder}
              alt='Icone Ordenamento'
              className={ascOrDesc ? 'rotate-0' : 'rotate-180'}
            />
          </span>
          <span className='margin-top-20px width-day'>Dia da semana</span>
          <span className='margin-top-20px width-description'>Descrição</span>
          <span className='margin-top-20px width-category'>Categoria</span>
          <span className='margin-top-20px width-value'>Valor</span>
          <span className='empty-span'></span>
        </div>
      </div>
      <div>
        {transactions.map((transaction) =>
        (
          <div
            key={transaction.id}
            className='cabeçalho-linha margin-top'>
            <span className='margin-top-20px width-data fonts'>{correctDate(transaction.data)}</span>
            <span className='margin-top-20px width-day fonts'>{getWeekDay(transaction.data)}</span>
            <span className='margin-top-20px width-description fonts'>{transaction.descriçao}</span>
            <span className='margin-top-20px width-category fonts'>{transaction.categoria_nome}</span>
            <span className={transaction.tipo === 'entrada' ?
              'margin-top-20px width-value credit' :
              'margin-top-20px width-value debit'}>{correctValue(transaction.valor)}</span>
            <span className='margin-top-20px'>
              <img
                src={EditIcon}
                className='edit-icon'
                alt='icone de editar transação'
                onClick={(e) => handleEditTransaction({
                  valor: transaction.valor,
                  data: transaction.data,
                  descricao: transaction.descriçao,
                  tipo: transaction.tipo,
                  categoria_id: transaction.categoria_id,
                  id_transacao: transaction.id
                })} />
              {showModalEditTransaction &&
                <ModalAddEditTransaction
                  setShowModalAddEditTransaction={setShowModalEditTransaction}
                  h1modal={'Editar Registro'}
                  setExtract={setExtract}
                  listCategories={listCategories}
                  setTransacionsList={setTransacionsList}
                  transactionToEdit={transactionToEdit}
                  typeTransaction={transaction.tipo}
                />
              }
              <img src={DeleteIcon}
                className='delete-icon'
                alt='icone de deletar transação'
                onClick={(e) => handleShowDeletePopUp(e, transaction.id)}
              />
              {showDeletePopUp === transaction.id && <div className='del-confirmation'>
                <span className='span-delete'>Apagar item?</span>
                <div className='btn-container'>
                  <button className='btn-small background-blue'
                    onClick={(e) => handleDelete(e, transaction.id)}
                  >
                    Sim
                  </button>
                  <button className='btn-small background-red'
                    onClick={(e) => handleNoDelete(e)}
                  >
                    Não
                  </button>
                </div>
              </div>}
            </span>
          </div>
        )
        )}

      </div>
    </div>
  );
}

export default TransactionList;