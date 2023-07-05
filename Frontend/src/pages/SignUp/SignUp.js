import './SignUp.css';
import '../../styles/global.css'
import '../../styles/colors.css'
import '../../styles/fonts.css'
import HeaderFreeRoute from '../../components/Header-Route-Free';
import ButtonDefault from '../../components/Button-Default';
import FormLoginRegister from '../../components/Form-Login-Register';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate()

  const [mode, setMode] = useState('login');

  const [errorMessage, setErrorMessage] = useState('')

  const [form, setForm] = useState(
    {
      nome: '',
      email: '',
      senha: '',
      confirmacaoSenha: ''
    }
  );

  function handleChangeModeToRegister() {
    setMode('register')
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

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/main')
    }
  })

  return (
    <div className='container-background-image container-main'>
      <HeaderFreeRoute />
      <main className='main-content'>
        {mode === 'login' &&
          <div className='info-to-user'>
            <h1 className='user-message-principal'>
              Controle suas <span className='user-message-principal-emphasis'>finanças</span>
              , sem planilha chata.
            </h1>
            <h2 className='user-message-secundary'>Organizar as suas
              finanças nunca foi tão fácil,
              com o DINDIN, você tem tudo num único lugar
              e em um clique de distância.
            </h2>
            <ButtonDefault
              width={284}
              content="Cadastre-se"
              marginTop={43}
              defaultFunction={handleChangeModeToRegister}
            />
          </div>
        }

        <div className='user-login-area'>
          <FormLoginRegister
            mode={mode}
            setMode={setMode}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            form={form}
            setForm={setForm}
          />
        </div>

      </main>
    </div>
  );
}

export default SignUp;
