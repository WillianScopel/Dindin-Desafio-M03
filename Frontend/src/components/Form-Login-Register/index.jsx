import './styles.css'
import '../../styles/global.css'
import '../../styles/colors.css'
import '../../styles/fonts.css'
import ButtonDefault from '../Button-Default'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

function FormLoginRegister({ mode, setMode, errorMessage, setErrorMessage, form, setForm }) {
  const navigate = useNavigate()

  async function handleNewLoginOrRegister() {

    if (!form.email || !form.senha) {
      if (mode === 'login') {
        setErrorMessage('Você precisa digitar o seu e-mail e senha para entrar')
        return
      }
      setErrorMessage('Você deve preencher todos os campos para se cadastrar')
      return
    }

    if (mode === 'register') {
      if (!form.nome || !form.confirmacaoSenha) {
        setErrorMessage('Você deve preencher todos os campos para se cadastrar')
        return
      }

      if (form.senha.length < 8) {
        setErrorMessage('Sua senha precisa ter ao menos 8 caracteres')
        return
      }

      if (form.senha !== form.confirmacaoSenha) {
        setErrorMessage('Os campos "Senha" e "Confirmação de Senha" não são iguais!')
        return
      }
    }

    try {
      const response = await api.post(mode === 'register' ? '/usuario' : '/login', form)

      if (mode === 'login') {
        localStorage.setItem('token', `${response.data.token}`)
        localStorage.setItem('userId', `${response.data.user.id}`)
        localStorage.setItem('nome', `${response.data.user.nome}`)
        localStorage.setItem('email', `${response.data.user.email}`)
        navigate('/main')
        return
      }

      setMode('login')

      setForm(
        {
          nome: '',
          email: '',
          senha: '',
          confirmacaoSenha: ''
        }
      )

    } catch (error) {

      if (mode === 'register') {
        setErrorMessage('O e-mail já está cadastrado no site')
        return
      }

      setErrorMessage('E-mail ou senha inválidos')
      return
    }

  }

  function handleChangeForm(e) {
    const value = e.target.value

    setErrorMessage('')

    setForm({ ...form, [e.target.name]: value })
  }

  function handleClearFormAndChangeMode() {
    setMode('login')
    setErrorMessage('')
    setForm(
      {
        nome: '',
        email: '',
        senha: '',
        confirmacaoSenha: ''
      }
    )
  }

  return (
    <div className={mode === 'register' ? 'form-register-area' : 'form-login-area'}>
      <h1 className='form-name'>{mode === 'register' ? 'Cadastre-se' : 'Login'}</h1>
      <div className='error-message-area'>
        {errorMessage &&
          <h3 className='error-message'>{errorMessage}</h3>
        }
      </div>
      <form className='form-login-register'>
        {mode === 'register' &&
          <label
            htmlFor='name'
            className='label-form-login-register'
          >
            Nome
          </label>
        }
        {mode === 'register' &&
          <input
            className='input-for-login-register'
            type="text"
            name="nome"
            value={form.nome}
            onChange={(e) => handleChangeForm(e)}
          />
        }
        <label
          htmlFor="email"
          className='label-form-login-register'>
          E-mail
        </label>
        <input
          className='input-for-login-register'
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => handleChangeForm(e)}
        />
        <label
          htmlFor="password"
          className='label-form-login-register'>
          Senha
        </label>
        <input
          className='input-for-login-register'
          type="password"
          name="senha"
          value={form.senha}
          onChange={(e) => handleChangeForm(e)}
        />
        {mode === 'register' &&
          <label
            className='label-form-login-register'
            htmlFor='password-confirm'
          >Confirmação de Senha</label>
        }
        {mode === 'register' &&
          <input
            className='input-for-login-register'
            type="password"
            name="confirmacaoSenha"
            value={form.confirmacaoSenha}
            onChange={(e) => handleChangeForm(e)}
          />
        }
      </form>
      <ButtonDefault
        width={449}
        marginTop={20}
        content={mode === 'register' ? 'Cadastrar' : 'Entrar'}
        defaultFunction={handleNewLoginOrRegister}
      />
      {mode === 'register' &&
        <h3
          onClick={() => handleClearFormAndChangeMode()}
          className='user-have-account' >Já tem cadastro? Clique aqui!</h3>
      }
    </div>
  )
}

export default FormLoginRegister