import './styles.css'
import closeIconModal from '../../assets/close-icon-modal.svg'
import ButtonDefault from '../Button-Default/'
import { useState } from 'react'
import api from '../../services/api'


function ModalEditProfile({ setShowModalEditProfileState }) {
  const [errorMessage, setErrorMessage] = useState('')
  const nome = localStorage.getItem('nome')
  const email = localStorage.getItem('email')

  const [form, setForm] = useState(
    {
      nome: '' || nome,
      email: '' || email,
      senha: '',
      confirmPassword: ''
    }
  )

  function handleChangeForm(e) {
    const value = e.target.value
    setErrorMessage('')
    setForm({ ...form, [e.target.name]: value })
  }

  async function handleEditProfile() {
    if (form.senha !== form.confirmPassword) {
      return
    }
    try {
      const userDataUpdate = {
        nome: form.nome,
        email: form.email,
        senha: form.senha
      }

      const token = localStorage.getItem('token')

      const response = await api.put('/usuario', userDataUpdate, {
        headers: { 'authorization': `Bearer ${token}` }
      })
      localStorage.setItem('nome', `${userDataUpdate.nome} `)
      localStorage.setItem('email', `${userDataUpdate.email}`)
      setShowModalEditProfileState(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='modal-edit-profile'>
      <div className='modal-container'>
        <img
          src={closeIconModal}
          className='close-icon'
          onClick={() => setShowModalEditProfileState(false)}
        />
        <h1 className='h1-modal'>Editar Perfil</h1>
        <form className='form-edit-profile'>
          <label
            htmlFor='name'
            className='label-form-edit-profile'
          >
            Nome
          </label>
          <input
            className='input-edit-profile'
            type="text"
            name="nome"
            value={form.nome}
            onChange={(e) => handleChangeForm(e)}
          />

          <label
            htmlFor="email"
            className='label-form-edit-profile'>
            E-mail
          </label>
          <input
            className='input-edit-profile'
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => handleChangeForm(e)}
          />
          <label
            htmlFor="password"
            className='label-form-edit-profile'>
            Senha
          </label>
          <input
            className='input-edit-profile'
            type="password"
            name="senha"
            value={form.senha}
            onChange={(e) => handleChangeForm(e)}
          />

          <label
            className='label-form-edit-profile'
            htmlFor='password-confirm'
          >Confirmação de Senha</label>
          <input
            className='input-edit-profile'
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => handleChangeForm(e)}
          />
          {errorMessage &&
            <h3 className='error-message'>{errorMessage}</h3>
          }
          <ButtonDefault
            width={236}
            height={46}
            marginTop={22}
            content={'Confirmar'}
            defaultFunction={() => handleEditProfile()}
          />
        </form>

      </div>
    </div>
  )
}

export default ModalEditProfile