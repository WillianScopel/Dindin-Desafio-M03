import './main.css';
import '../../styles/global.css'
import '../../styles/colors.css'
import '../../styles/fonts.css'
import HeaderFreeRoute from '../../components/Header-Route-Free';
import ModalEditProfile from '../../components/Modal-Edit-Profile/index'
import TransactionList from '../../components/Transaction-List';
import ButtonDefault from '../../components/Button-Default';
import ModalAddEditTransaction from '../../components/Modal-Add-Edit-Transaction';
import Filter from '../../components/Filter';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { balanceCalc, correctDate, correctValue, getWeekday, orderByDateAsc, orderByDateDesc } from '../../utils/utils'


function Main() {
  const [showModalEditProfileState, setShowModalEditProfileState] = useState(false)
  const [showModalAddEditTransaction, setShowModalAddEditTransaction] = useState(false)
  const [listCategories, setListCategories] = useState([])
  const [transactions, setTransacionsList] = useState([])
  const [extract, setExtract] = useState([])
  const [ascOrDesc, setAscOrDesc] = useState(false);
  const [filtredTransactions, setFiltredTransactions] = useState([])
  const [startFilter, setStatFilter] = useState(false)
  const [baseSearch, setBaseSearch] = useState([])

  useEffect(() => {
    handleTransactionsList()
    handleGetExtract()
  }, [ascOrDesc, filtredTransactions])

  useEffect(() => {
    handleListCategories()
  }, [])

  async function handleTransactionsList() {
    const token = localStorage.getItem('token')

    try {
      const response = await api.get(`/transacao`,
        { headers: { 'authorization': `Bearer ${token}` } }
      )

      setBaseSearch(response.data)

      if (startFilter || filtredTransactions.length > 0) {
        setTransacionsList(ascOrDesc ? orderByDateAsc(filtredTransactions) : orderByDateDesc(filtredTransactions))
        return
      }

      setTransacionsList(ascOrDesc ? orderByDateAsc(response.data) : orderByDateDesc(response.data))

    } catch (error) {
    }
  }

  async function handleListCategories() {
    try {
      const token = localStorage.getItem('token')

      const response = await api.get('/categoria', {
        headers: { 'authorization': `Bearer ${token}` }
      })
      setListCategories(response)

    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetExtract() {
    const token = localStorage.getItem('token')

    try {
      const response = await api.get(`/transacao/extrato`,
        { headers: { 'authorization': `Bearer ${token}` } }
      )
      setExtract(response.data)
    } catch (error) {
    }
  }

  return (
    <div className='container-page-main'>
      <HeaderFreeRoute
        logged={'logged'}
        setShowModalState={setShowModalEditProfileState}
      >
      </HeaderFreeRoute>

      <main className='main-page-main'>
        <div className='content-page-main'>
          <div className='filter-and-transactions'>
            <div className='filter-on-main'>
              <Filter
                baseSearch={baseSearch}
                setTransacionsList={setTransacionsList}
                handleTransactionsList={handleTransactionsList}
                filtredTransactions={filtredTransactions}
                setFiltredTransactions={setFiltredTransactions}
                startFilter={startFilter}
                setStatFilter={setStatFilter}
              />
            </div>
            <div className='transactions-on-main'>
              <TransactionList
                setTransacionsList={setTransacionsList}
                transactions={transactions}
                correctDate={correctDate}
                getWeekDay={getWeekday}
                setShowModalAddEditTransaction={setShowModalAddEditTransaction}
                handleTransactionsList={handleTransactionsList}
                setAscOrDesc={setAscOrDesc}
                ascOrDesc={ascOrDesc}
                listCategories={listCategories}
                setExtract={setExtract}
              />
            </div>
          </div>
          <div className='summary-on-main'>
            <div className='summary'>
              <h2 className='summary-title'>Resumo</h2>
              <div className='transaction-info margin-transaction'>
                <h3 className='transaction-info-font'>Entradas</h3>
                <h3 className='transaction-info-font credit'>{correctValue(extract.entrada)}</h3>
              </div>
              <div className='transaction-info'>
                <h3 className='transaction-info-font'>Saídas</h3>
                <h3 className='transaction-info-font debit'>{correctValue(extract.saida)}</h3>
              </div>
              <div className='transaction-div'></div>
              <div className='transaction-info'>
                <h3 className='balance'>Saldo</h3>
                <h3
                  className={`balance balance-value-${balanceCalc(extract.entrada, extract.saida) >= 0 ? 'positive' : 'negative'}`}>
                  {correctValue(balanceCalc(extract.entrada, extract.saida))}</h3>
              </div>
            </div>

            <ButtonDefault
              width={236}
              height={46}
              content="Adicionar Registro"
              marginTop={16}
              defaultFunction={() => setShowModalAddEditTransaction(true)}
            />
          </div>

          {showModalAddEditTransaction &&
            <ModalAddEditTransaction
              setShowModalAddEditTransaction={setShowModalAddEditTransaction}
              h1modal={'Adicionar Registro'}
              listCategories={listCategories}
              setTransacionsList={setTransacionsList}
              transactionToEdit=''
              typeTransaction={'saida'}
              setExtract={setExtract}
            />
          }
          {showModalEditProfileState &&
            <ModalEditProfile
              setShowModalEditProfileState={setShowModalEditProfileState}
            />
          }
        </div>
      </main >
    </div >
  );
}

export default Main;