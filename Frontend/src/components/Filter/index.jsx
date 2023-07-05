import './styles.css';
import '../../styles/global.css';
import '../../styles/colors.css';
import '../../styles/fonts.css';
import ImagemFiltro from '../../assets/filter.png'
import { useEffect, useState } from 'react';
import OptionsCategories from '../Options-Categories';
import api from '../../services/api';


function Filter({ baseSearch, handleTransactionsList, setFiltredTransactions, startFilter, setStatFilter }) {
  const [filter, setFilter] = useState(false)

  const [optionSelected, setOptionSelected] = useState([])

  const [optionsForRender, setOptionsForRender] = useState([])

  const [clearFilter, setClearFilter] = useState(false)

  async function handleGetCategories() {
    const token = localStorage.getItem('token')

    try {
      const response = await api.get(`/categoria`,
        { headers: { 'authorization': `Bearer ${token}` } }
      )
      setOptionsForRender(response.data)

    } catch (error) {
    }
  }

  useEffect(() => {
    if (startFilter) {

      handleTransactionsList()

      const resultOfFilter = []

      for (let option of optionSelected) {
        const filtred = baseSearch.filter((transacao) => transacao.categoria_nome === option)
        resultOfFilter.push(...filtred)
      }

      setFiltredTransactions(resultOfFilter)
    }
  }, [startFilter])

  useEffect(() => {
    handleGetCategories()
  }, [optionSelected])

  function handleChangeFilter() {
    setFilter(!filter)
  }

  function handleClearFilter() {
    setOptionSelected([])
    setClearFilter(true)
    handleTransactionsList()
    setFiltredTransactions([])
    setStatFilter(false)


    setTimeout(() => {
      setClearFilter(false)
    }, 50);

  }

  function handleChangeStartFilter() {
    if (optionSelected.length === 0) {
      return
    }

    setStatFilter(true)

    setTimeout(() => {
      setStatFilter(false)
    }, 50);
  }

  return (
    <div>
      <button
        className='filter-for-categories'
        onClick={() => handleChangeFilter()}
      >
        <img src={ImagemFiltro} alt="Imagem Filtro" />
        Filtrar
      </button>
      {filter &&
        <div className='options-area'>
          <div className="categories-for-pick">
            <h1 className="title-categories">
              Categoria
            </h1>
            <div className="categories-for-filter">
              {optionsForRender.map((option) => <OptionsCategories
                key={option.id}
                nome={option.descricao}
                optionSelected={optionSelected}
                setOptionSelected={setOptionSelected}
                optionsForRender={optionsForRender}
                clearFilter={clearFilter}
              />)}
            </div>
            <div className='buttons-hub'>
              <button
                className="clear-filter"
                onClick={() => handleClearFilter()}
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => handleChangeStartFilter(true)}
                className="apply-filters">
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  )
}


export default Filter