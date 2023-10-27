import './admin.css'
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import logo from '../../images/logo.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faTrash,
  faUsers,
  faFileInvoice,
  faChartSimple,
  faCoins,
  faDatabase,
  faTableList,
  faAngleUp,
  faList,
  faHouse,
  faChevronDown,
  faUserPlus,
  faArrowRightFromBracket,
  faBars,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faUser,
  faTrash,
  faFileInvoice,
  faChartSimple,
  faCoins,
  faDatabase,
  faTableList,
  faHouse,
  faChevronDown,
  faFileInvoice,
  faUserPlus,
  faUsers,
  faArrowRightFromBracket,
  faBars,

  faBars,
  faArrowLeft
);

const Admin = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log(user);
      alert('Se ha cerrado la sesiÃ³n');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <div>
      <header className='header'>
        <div className='contenedor-header'>
          <div className='btn-menu'>
            <label for="btn-menu"><FontAwesomeIcon icon="fa-solid fa-bars" className='icon-menu'/> </label>
            
            <Link to="/indexAdmin"  className='menu_home'>
              <label><FontAwesomeIcon icon="fa-solid fa-house" className='icon-menu'/> </label>
            </Link>
          </div>
          
          <div className='logo'>
            <h1>Hams Motors</h1>
          </div>
          <nav className='menu'>
            <a>inicio</a>
            <a>email</a>
            <a>usuarios</a>
            <a>registros</a>
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
            <br />
    <hr />
            <Link to='/indexAdmin' className='link'>
              <div className='logo_details'>
                <FontAwesomeIcon className='i' icon="fa-solid fa-user" />
                <span className='logo_name'>Hans Motors</span>
              </div>
            </Link>
            <Link to="/agregarUsuario" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-user-plus" />
              <span className='link_name'>Crear Usuarios</span>
            </Link>
            <Link to="/listarUsuario" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-users" />
              <span className='link_name'>Listar Usuarios</span>
            </Link>
    <hr />
            <Link to="/agregarFactura" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-users" />
              <span className='link_name'>Agregar Factura</span>
            </Link>
            <Link to="/listadoFacturas" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-users" />
              <span className='link_name'>Listar Factura</span>
            </Link>
    <hr />
            <Link to="/agregarInventario" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-users" />
              <span className='link_name'>Agregar Inventario</span>
            </Link>
            <Link to="/listarInventario" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-users" />
              <span className='link_name'>Listar Inventario</span>
            </Link>
    <hr />
            <li>
              <div className='profile_details'>
                <div className='profile_content'>
                  {/* <img src={logo} alt='logo' /> */}
                </div>
                <div className='name-job'>
                  <div className='profile_name'>administrador</div>
                  {/* <div className='profile_name'>yo mismo</div> */}
                </div>
                <button type='submit' onClick={handleLogout}>
                  <FontAwesomeIcon className='i' icon={['fas', 'arrow-right-from-bracket']} rotation={180} />
                </button>
              </div>
            </li>
          </nav>
          <label for="btn-menu"><FontAwesomeIcon icon="fa-solid fa-arrow-left" /> </label>
        </div>
      </div>
    </div>
  </>
  )
}

export default Admin;