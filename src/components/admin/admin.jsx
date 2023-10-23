import '../../../src/styles/Globals.css'
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
  faBars
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

  // let sidebar = document.querySelector(".sidebar");
  // let sidebarBtn = document.querySelector(".menu");
  // console.log(sidebar);
  // sidebarBtn.addEventListener("click", ()=>{
  //   sidebar.classList.toggle('close');
  // });

  return (
  
  <div>



    <div className='sidebar' >

    
      <Link to='/admin' className='link' st>
        <div className='logo_details'>
          <FontAwesomeIcon className='i' icon="fa-solid fa-user" />
          <span className='logo_name'>Hans Motors</span>
        </div>
      </Link>

      <ul className='nav_links close'>
      <hr></hr>
        <li>
          <div className='icon_link'>
            <Link to="" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-user" />
              <span className='link_name'>Usuarios</span>
            </Link>            
          </div>
        </li>
        <li>
          <div className='icon_link'>
            <Link to="/agregarUsuario" className='link'>
            <FontAwesomeIcon className='i' icon="fa-solid fa-user-plus" />              
            <span className='link_name'>Crear Usuarios</span>
            </Link>            
          </div>
        </li>
        <li>
          <div className='icon_link'>
            <Link to="/listarUsuario" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-users" />              
              <span className='link_name'>Listar Usuarios</span>
            </Link>            
          </div>
        </li>
        <hr></hr>
        <li>
          <div className='icon_link'>
            <Link to="" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-invoice" />
              <span className='link_name'>Facturas</span>
            </Link>
          </div>
        </li>
        <li>
          <div className='icon_link'>
            <Link to="" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-invoice" />
              <span className='link_name'>Crear Facturas</span>
            </Link>
          </div>
        </li>
        <li>
          <div className='icon_link'>
            <Link to="" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-invoice" />
              <span className='link_name'>Listar Facturas</span>
            </Link>
          </div>
        </li>
        <li>
          <div className='icon_link'>
            <Link to="" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-invoice" />
              <span className='link_name'>Eliminar Facturas</span>
            </Link>
          </div>
        </li>
        <hr></hr>
        <li>
          <div className='icon_link'>
            <Link to="" className='link'>
              <FontAwesomeIcon className='i' icon="fa-solid fa-file-invoice" />
              <span className='link_name'>Trabajos</span>
            </Link>
          </div>
        </li>


        <li>
          <div className='profile_details'>
            <div className='profile_content'>
              <img src={logo} alt='logo' />
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

      </ul>


    </div>
{/* 
    <section className='home-section'>
        <div className='home-content'>
          <FontAwesomeIcon className='menu' icon="fa-solid fa-bars" />
          <span className='text'>drop</span>
        </div>
    </section>  */}

  </div>

  )
}

export default Admin;