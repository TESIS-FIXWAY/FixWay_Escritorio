// Componente Mecanico:  
// Este componente React representa la barra de navegación y menú lateral para usuarios con el rol de Mecánico. 
// Proporciona acceso a diversas funcionalidades y permite la navegación fluida entre las secciones de la aplicación. 
// Funciones y Características Principales: 
// Utiliza estilos específicos para la interfaz del Mecánico importados desde 'admin.css'. 
// Incluye un reloj que muestra la hora actual en tiempo real. 
// Permite la navegación a la página de inicio ('indexMecanico') mediante un botón en el menú. 
// Ofrece accesos directos a las secciones de gestión de mantenciones, listar inventario, generar códigos QR, y generar listados de mantenciones en el menú lateral. 
// Utiliza FontAwesome para incluir iconos visuales en la interfaz y mejorar la experiencia del usuario. 
// Permite al usuario cerrar sesión con el botón 'Salir' y redirige a la página de inicio al hacerlo. 

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
  faHouse,
  faQrcode
} 
from '@fortawesome/free-solid-svg-icons';
library.add(
  faBars,
  faArrowLeft,
  faArrowRightFromBracket,
  faUser,
  faUserPlus,
  faUsers,
  faHouse,
  faQrcode
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
            <Link to="/indexMecanico"  className='menu_home'>
              <label><FontAwesomeIcon icon="fa-solid fa-house" className='icon-menu'/></label>
            </Link>
          </div>
          <div className='logo'>
            <h1>Hans Motors</h1>
          </div>
          <div className="reloj">
            <p>{formatTime(currentTime)}</p>
          </div>
          <nav className='menu'>
            <a>Mecánico</a>
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
            <Link to="/indexMecanico" className={`link ${window.location.pathname === '' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-house" />
              <span className='link_name'>Volver al Menú</span>
            </Link>
<hr />
            <Link to="/gestionMantenciones" className={`link ${window.location.pathname === '' ? 'active' : ''}`}>
              <FontAwesomeIcon icon="fa-solid fa-clipboard-list"  className='i'/>
              <span className='link_name'>Gestion de Mantenciones</span>
            </Link>
            <Link to="/listarInventarioMecanico" className={`link ${window.location.pathname === '' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-list" />
              <span className='link_name'>Listar Inventario</span>
            </Link>
            <Link to="/GenerarQR" className={`link ${window.location.pathname === '' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-qrcode" />              
              <span className='link_name'>Generar QR</span>
            </Link>
            <Link to="/GenerarListadoMantencion" className={`link ${window.location.pathname === '' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-pdf" />
              <span className='link_name'>Generar Listado Mantencion</span>
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