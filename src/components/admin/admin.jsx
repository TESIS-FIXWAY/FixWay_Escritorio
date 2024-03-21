import '../styles/admin.css'
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
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
  faReceipt,
  faChevronDown,
  faChevronRight
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
  faReceipt,
  faChevronDown,
  faChevronRight
);

const Admin = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  
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
      timeZone: 'America/Santiago', 
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

  const toggleSubMenu = (event) => {
    event.preventDefault(); // Prevent default link behavior
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  
  return (
    <>
    <div>
      <header className='header'>
        <div className='contenedor-header'>
          <div className='btn-menu'>
            <label htmlFor="btn-menu"><FontAwesomeIcon icon="fa-solid fa-bars" className='icon-menu' /></label>
            <Link to="/indexAdmin"  className='menu_home'>
              <label><FontAwesomeIcon icon="fa-solid fa-house" className='icon-menu' beat/></label>
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
              <span className='link_name'>Volver al Menú</span>
            </Link>

<hr />
            <div
                className={isSubMenuOpen ? 'link active' : 'link'}
                onMouseEnter={() => setIsSubMenuOpen(true)}
                onMouseLeave={() => setIsSubMenuOpen(false)}
            >
                <FontAwesomeIcon className='i' icon="fa-solid fa-user" />
                <span className='link_name'>Gestionar Usuarios</span>
                <div className="icon-container">
                    <FontAwesomeIcon
                        icon={isSubMenuOpen ? "fa-solid fa-chevron-right" : "fa-solid fa-chevron-down"}
                    />
                </div>
                <div className="sub-menu">
                    <Link to="/agregarUsuario" className={`link ${window.location.pathname === '/agregarUsuario' ? 'active' : ''}`}>
                        <FontAwesomeIcon className='i' icon="fa-solid fa-user-plus" />
                        <span className='link_name'>Crear Usuarios</span>
                    </Link>
                    <Link to="/listarUsuario" className={`link ${window.location.pathname === '/listarUsuario' ? 'active' : ''}`}>
                        <FontAwesomeIcon className='i' icon="fa-solid fa-users" />
                        <span className='link_name'>Listar Usuarios</span>
                    </Link>
                </div>
            </div>

<hr />

            <Link to="/gestionMantencionesAdmin" className={`link ${window.location.pathname === '/gestionMantencionesAdmin' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-rectangle-list"  />              
              <span className='link_name'>Gestión de Mantenciones</span>
            </Link>
<hr />
            <div
                className={isSubMenuOpen ? 'link active' : 'link'}
                onMouseEnter={() => setIsSubMenuOpen(true)}
                onMouseLeave={() => setIsSubMenuOpen(false)}
            >
                <FontAwesomeIcon className='i' icon="fa-solid fa-user" />
                <span className='link_name'>Facturas</span>
                <div className="icon-container">
                    <FontAwesomeIcon
                        icon={isSubMenuOpen ? "fa-solid fa-chevron-right" : "fa-solid fa-chevron-down"}
                    />
                </div>
                <div className="sub-menu">
                  <Link to="/agregarFactura" className={`link ${window.location.pathname === '/agregarFactura' ? 'active' : ''}`}>
                    <FontAwesomeIcon className='i' icon="fa-solid fa-file-circle-plus" />              
                    <span className='link_name'>Agregar Factura de Proveedor</span>
                  </Link>
                  <Link to="/listadoFacturas" className={`link ${window.location.pathname === '/listadoFacturas' ? 'active' : ''}`}>
                    <FontAwesomeIcon className='i' icon="fa-solid fa-clipboard-list" />
                    <span className='link_name'>Listar Facturas de Proveedores</span>
                  </Link>
                  <Link to="/listadoMisFacturas" className={`link ${window.location.pathname === '/listadoMisFacturas' ? 'active' : ''}`}>
                    <FontAwesomeIcon className='i' icon="fa-solid fa-clipboard-list" />
                    <span className='link_name'>Listar de Mis Facturas <br /> / Boletas</span>
                  </Link>
                </div>
            </div>

            <Link to="/agregarFactura" className={`link ${window.location.pathname === '/agregarFactura' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-circle-plus" />              
              <span className='link_name'>Agregar Factura de Proveedor</span>
            </Link>
            <Link to="/listadoFacturas" className={`link ${window.location.pathname === '/listadoFacturas' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-clipboard-list" />
              <span className='link_name'>Listar Facturas de Proveedores</span>
            </Link>
            <Link to="/listadoMisFacturas" className={`link ${window.location.pathname === '/listadoMisFacturas' ? 'active' : ''}`}>
              <FontAwesomeIcon className='i' icon="fa-solid fa-clipboard-list" />
              <span className='link_name'>Listar de Mis Facturas <br /> / Boletas</span>
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
              <FontAwesomeIcon className='i' icon="fa-solid fa-receipt" />              
              <span className='link_name'>Generar Factura de Vendedor</span>
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