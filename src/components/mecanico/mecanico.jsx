import '../styles/admin.css'
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faArrowLeft,
  faArrowRightFromBracket,
  faUser,
  faUserPlus,
  faUsers,
  faHouse
} 
from '@fortawesome/free-solid-svg-icons';
library.add(
  faBars,
  faArrowLeft,
  faArrowRightFromBracket,
  faUser,
  faUserPlus,
  faUsers,
  faHouse
);

const Mecanico = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZone: 'America/Santiago', // Zona horaria de Santiago, Chile
    };
    return time.toLocaleTimeString('en-US', options);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log(user);
      alert('Se ha cerrado la sesión');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div>
      <header className='header'>
        <div className='contenedor-header'>
          <div className='btn-menu'>
            <label for="btn-menu"><FontAwesomeIcon icon="fa-solid fa-bars" className='icon-menu'/></label>
            <Link to=""  className='menu_home'>
              <label><FontAwesomeIcon icon="fa-solid fa-house" className='icon-menu'/></label>
            </Link>
          </div>
          <div className='logo'>
            <h1>Hams Motors</h1>
          </div>
          <div className="reloj">
            <p>{formatTime(currentTime)}</p>
          </div>
          <nav className='menu'>
            <a>Mecanico</a>
          </nav>
        </div>
        <button type='submit' onClick={handleLogout} className='boton_salir'>
          <FontAwesomeIcon className='i' icon={['fas', 'arrow-right-from-bracket']} rotation={180} />
        </button>
      </header> 
      <div className='capa'></div>
      <input type='checkbox' id='btn-menu'></input>
      

      <div className='contenedor-menu'>
        <div className='cont_menu'>
          
          <nav>
            <Link to="" className={`link ${window.location.pathname === '' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-house" />
              <span className='link_name'>volver al menu</span>
            </Link>
<hr />
            <Link to="" className={`link ${window.location.pathname === '' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-house" />
              <span className='link_name'>generar cotizacion</span>
            </Link>
          </nav>

          <label for="btn-menu"><FontAwesomeIcon icon="fa-solid fa-arrow-left" /></label>
        </div>
      </div>
    
    </div>
  </>
  )
}

export default Mecanico;