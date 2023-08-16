import './styles.css'
import '../../styles/global.css'
import '../../styles/colors.css'
import Logo from '../../assets/Logo.png'
import AvatarIcon from '../../assets/avatar-profile-icon.svg'
import IconLogout from '../../assets/icon-logout.svg'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { firstName } from '../../utils/utils'

function HeaderFreeRoute({ logged, setShowModalState }) {
  const navigate = useNavigate()

  const [nameUser, setNameUser] = useState([])

  async function handleGetUser() {
    const token = localStorage.getItem('token')

    try {
      const response = await api.get(`/usuario`,
        { headers: { 'authorization': `Bearer ${token}` } }
      )

      setNameUser(firstName(response.data.nome))

    } catch (error) {
    }
  }

  useEffect(() => {

    if (logged === 'logged') {
      handleGetUser()
    }

  }, [])


  function handleLogOut() {
    localStorage.clear()
    navigate('/')
  }

  return (
    <header className={logged ? 'header-route-free background-color' : 'header-route-free'} >
      <img className='logo-header' src={Logo} alt="Logo DinDin" />
      {logged &&
        <div className='box-profile'>
          <img className='icon-avatar'
            src={AvatarIcon}
            alt='Icone-perfil-usuário'
            onClick={() => setShowModalState(true)}
          />
          <span>{nameUser}</span>
          <img
            className='icon-logout'
            src={IconLogout}
            onClick={() => handleLogOut()}
          />
        </div>
      }
    </header >
  )
}

export default HeaderFreeRoute