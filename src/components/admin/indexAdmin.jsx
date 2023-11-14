import '../styles/indexAdmin.css';
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
      <div className="tabla_listar">

        <div className='card_admin_calendario'>
          <div className='calendario'>
            <h1 className=''>Calendario</h1>
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
        </div>

        {/* <div className='grafico_barras'>
          <Bar data={chartData} />
        </div> */}

        <div className='contenedor_cartas_iconos'>

          <div className='cartas_iconos'  onClick={usuarios}>
            <FontAwesomeIcon icon="fa-solid fa-user-plus" className='functionality_icon' />
            <p>Agregar usuario</p>
          </div>

          <div className='cartas_iconos' onClick={listarUsuarios}>
            <FontAwesomeIcon icon="fa-solid fa-users-line" className='functionality_icon' />
            <p>Listar usuarios</p>
          </div> 

          <div className='cartas_iconos' onClick={facturas}>
          <FontAwesomeIcon icon="fa-solid fa-file-circle-plus" className='functionality_icon' />
            <p>Agregar factura de proveedores</p>
          </div>  

          <div className='cartas_iconos' onClick={listarFacturas}>
            <FontAwesomeIcon icon="fa-solid fa-file-lines" className='functionality_icon' />
            <p>Listar facturas de proveedores</p>
          </div> 
          
          <div className='cartas_iconos' onClick={inventario}>
            <FontAwesomeIcon icon="fa-solid fa-file-lines" className='functionality_icon' />
            <p>Agregar inventario</p>
          </div> 

          <div className='cartas_iconos' onClick={listarInventario}>
            <FontAwesomeIcon icon="fa-solid fa-clipboard-list" className='functionality_icon' />
            <p>Listar inventario</p>
          </div> 

          <div className='cartas_iconos' onClick={listarInventario}>
            <FontAwesomeIcon icon="fa-solid fa-clipboard-list" className='functionality_icon' />
            <p>Generar factura de vendedor</p>
          </div> 
          
        </div>


      </div>
      
    </>
  );
};

export default IndexAdmin;