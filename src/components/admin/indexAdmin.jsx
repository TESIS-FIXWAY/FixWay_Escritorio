import './indexAdmin.css'
import React from "react";
import { useNavigate } from 'react-router-dom';
import usuario from '../../images/usuarios.png';
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
  faUsersGear,
  faFileLines,
  faUsersLine,
  faReceipt,
  faBoxesStacked,
  faCartFlatbed,
  faClipboardList
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
  faArrowLeft,
  faUsersGear,
  faFileLines,
  faUsersLine,
  faReceipt,
  faBoxesStacked,
  faCartFlatbed,
  faClipboardList
);

const IndexAdmin = () => {
  const navigate = useNavigate();

  const usuarios = () => {
    navigate('/agregarUsuario')
  }
  const listarUsuarios = () => {
    navigate('/listarUsuario')
  }
  const facturas = () => {
    navigate('/agregarFactura')
  }
  const listarFacturas = () => {
    navigate('/listadoFacturas')
  }
  const inventario = () => {
    navigate('/agregarInventario')
  }
  const listarInventario = () => {
    navigate('/listarInventario')
  }


  return (


    <>
      <Admin/>





        
        <div className='card_admin'>
        <div className='card_landing'>
            <h1> usuarios</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-users-gear" className='iconos'/>            
            <hr className='hr-container'/>
            <p className='p_card'>gestiona a los usuarios del taller</p>
            <p className='p_card'>agregar usuarios <FontAwesomeIcon icon="fa-solid fa-user-plus"  onClick={usuarios} className='iconos_boton'/> </p>
            <p className='p_card'>listar usuarios <FontAwesomeIcon icon="fa-solid fa-users-line" onClick={listarUsuarios} className='iconos_boton'/> </p>
        </div>

        <div className='card_landing'>
            <h1> facturas de proveedor</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-receipt" className='iconos'/>            
            <hr className='hr-container'/>
            <p className='p_card'>gestiona a las facturas del taller</p>
            <p className='p_card'>agregar facturas <FontAwesomeIcon icon="fa-solid fa-file-circle-plus" onClick={facturas} className='iconos_boton'/> </p>
            <p className='p_card'>listar facturas <FontAwesomeIcon icon="fa-solid fa-file-lines" onClick={listarFacturas} className='iconos_boton'/> </p>
        </div>

        <div className='card_landing'>
            <h1> inventario</h1>
            <hr className='hr-container'/>
            <FontAwesomeIcon icon="fa-solid fa-boxes-stacked" className='iconos'/>
            <hr className='hr-container'/>
            <p className='p_card'>gestiona el inventario taller</p>
            <p className='p_card'>agregar inventario <FontAwesomeIcon icon="fa-solid fa-cart-flatbed" onClick={inventario} className='iconos_boton'/> </p>
            <p className='p_card'>listar usuarios <FontAwesomeIcon icon="fa-solid fa-clipboard-list" onClick={listarInventario} className='iconos_boton'/> </p>
        </div>

        </div>


    </>
  );
};

export default IndexAdmin;