import './indexAdmin.css'
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import Admin from "./admin";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUsersGear,
  faReceipt,
  faBoxesStacked,
  faCartFlatbed,
  faClipboardList,
  faUserPlus,
  faUsersLine,
  faFileCirclePlus,
  faFileLines,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUsersGear,
  faReceipt,
  faBoxesStacked,
  faCartFlatbed,
  faClipboardList,
  faUserPlus,
  faUsersLine,
  faFileCirclePlus,
  faFileLines,
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Admin />

      <div className='card_admin_calendario'>
        <div className='calendario'>
          <h1 className=''>Calendario</h1>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
      </div>

      <div className='card_admin'>

        {/* Sección de Usuarios */}
        <div className='card_section'>
          <h1 className='section_title'>Usuarios</h1>
          <hr className='section_hr' />
          <FontAwesomeIcon icon="fa-solid fa-users-gear" className='section_icon' />
          <hr className='section_hr' />
          <p className='section_subtitle'>Gestiona a los usuarios del taller</p>
          <div className='card_functionality' onClick={usuarios}>
            <p>Agregar usuario</p>
            <FontAwesomeIcon icon="fa-solid fa-user-plus" className='functionality_icon' />
          </div>
          <div className='card_functionality' onClick={listarUsuarios}>
            <p>Listar usuarios</p>
            <FontAwesomeIcon icon="fa-solid fa-users-line" className='functionality_icon' />
          </div>
        </div>

        {/* Sección de Facturas de Proveedor */}
        <div className='card_section'>
          <h1 className='section_title'>Facturas de Proveedor</h1>
          <hr className='section_hr' />
          <FontAwesomeIcon icon="fa-solid fa-receipt" className='section_icon' />
          <hr className='section_hr' />
          <p className='section_subtitle'>Gestiona las facturas del taller</p>
          <div className='card_functionality' onClick={facturas}>
            <p>Agregar factura</p>
            <FontAwesomeIcon icon="fa-solid fa-file-circle-plus" className='functionality_icon' />
          </div>
          <div className='card_functionality' onClick={listarFacturas}>
            <p>Listar facturas</p>
            <FontAwesomeIcon icon="fa-solid fa-file-lines" className='functionality_icon' />
          </div>
        </div>

        {/* Sección de Inventario */}
        <div className='card_section'>
          <h1 className='section_title'>Inventario</h1>
          <hr className='section_hr' />
          <FontAwesomeIcon icon="fa-solid fa-boxes-stacked" className='section_icon' />
          <hr className='section_hr' />
          <p className='section_subtitle'>Gestiona el inventario del taller</p>
          <div className='card_functionality' onClick={inventario}>
            <p>Agregar inventario</p>
            <FontAwesomeIcon icon="fa-solid fa-cart-flatbed" className='functionality_icon' />
          </div>
          <div className='card_functionality' onClick={listarInventario}>
            <p>Listar inventario</p>
            <FontAwesomeIcon icon="fa-solid fa-clipboard-list" className='functionality_icon' />
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexAdmin;