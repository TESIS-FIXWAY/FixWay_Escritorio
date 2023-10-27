import './indexAdmin.css'
import React from "react";
import { useNavigate } from 'react-router-dom';
import Admin from "./admin";
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

const IndexAdmin = () => {
  const navigate = useNavigate();

  const usuarios = () => {
    navigate('/listarUsuario')
  }

  const facturas = () => {
    navigate('/listadoFacturas')
  }

  return (
    <>
      <Admin />
        <div className='card_admin'>
        <div className='card_landing' onClick={usuarios}>
            <h1>Lista Usuario</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-users" />
            <hr className='hr-container'/>
            <p>gestiona a los usuarios del taller</p>
        </div>
        <div className='card_info'></div>
        <div className='card_landing' onClick={facturas}>
            <h1>Lista Factura</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-users" />
            <hr  className='hr-container'/>
            <p>gestiona las facturas del taller</p>
        </div>
        <div className='card_info'></div>
        <div className='card_landing'>
            <h1>usuarios</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-users" />
            <hr className='hr-container'/>
            <p>gestiona a los usuarios del taller</p>
        </div>
        <div className='card_info'></div>
        </div>
    </>
  );
};

export default IndexAdmin;