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

const Admin = () => {
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
            <Link to="/indexAdmin"  className='menu_home'>
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
            <a>Administrador</a>
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
            <Link to="/indexAdmin" className={`link ${window.location.pathname === '/indexAdmin' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-house" />
              <span className='link_name'>volver al menu</span>
            </Link>
<hr />
            <Link to="/agregarUsuario" className={`link ${window.location.pathname === '/agregarUsuario' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-user-plus" />
              <span className='link_name'>Crear Usuarios</span>
            </Link>
            <Link to="/listarUsuario" className={`link ${window.location.pathname === '/listarUsuario' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-users" />
              <span className='link_name'>Listar Usuarios</span>
            </Link>
<hr />
            <Link to="/agregarFactura" className={`link ${window.location.pathname === '/agregarFactura' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-circle-plus" />              
              <span className='link_name'>Agregar Factura de proveedor</span>
            </Link>
            <Link to="/listadoFacturas" className={`link ${window.location.pathname === '/listadoFacturas' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-clipboard-list" />
              <span className='link_name'>Listar Facturas de proveedores</span>
            </Link>
<hr />
            <Link to="/agregarInventario" className={`link ${window.location.pathname === '/agregarInventario' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-cart-flatbed" />
              <span className='link_name'>Agregar Inventario</span>
            </Link>
            <Link to="/listarInventario" className={`link ${window.location.pathname === '/listarInventario' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-boxes-stacked" />
              <span className='link_name'>Listar Inventario</span>
            </Link>
<hr />
            <Link to="/generarFactura" className={`link ${window.location.pathname === '/generarFactura' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-lines" />
              <span className='link_name'>Generar Factura de vendedor</span>
            </Link>
          </nav>

          <label for="btn-menu"><FontAwesomeIcon icon="fa-solid fa-arrow-left" /></label>
        </div>
      </div>
    
    </div>
  </>
  )
}

export default Admin;