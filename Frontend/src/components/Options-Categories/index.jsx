import './styles.css';
import '../../styles/global.css';
import '../../styles/colors.css';
import '../../styles/fonts.css';
import { useEffect, useState } from 'react';


function OptionsCategories({ nome, setOptionSelected, optionSelected, optionsForRender, clearFilter }) {

  let [select, setSelect] = useState(false)

  function handleChangeSelect() {
    setSelect(!select)
  }

  function handleChangeOption() {
    if (select) {
      setOptionSelected([...optionSelected, nome])
      return
    }

    if (!select) {
      setOptionSelected([...optionSelected].filter((option) => {
        return option !== nome
      }))
    }
  }


  function handleMemoryOfFilter() {
    for (let option of [...new Set(optionSelected)]) {
      if (option === nome) {
        setSelect(true)
      }
    }
  }

  useEffect(() => {
    if (clearFilter) {
      for (let option of optionsForRender) {
        if (option.descricao === nome) {
          setSelect(false)
        }
      }
    }

  }, [clearFilter])

  useEffect(() => {
    handleChangeOption()
    // eslint-disable-next-line
  }, [select])

  useEffect(() => {
    handleMemoryOfFilter()
    // eslint-disable-next-line
  }, [optionSelected])


  return (
    <>
      <button
        className={`button-option ${select ? 'select' : 'unselect'}`}
        onClick={() => handleChangeSelect()}
      >
        <h4 className='option-name'>{nome}</h4>
        <h4 className="option-symbol">{select ? 'x' : '+'}</h4>
      </button>

    </>
  )
}

export default OptionsCategories

