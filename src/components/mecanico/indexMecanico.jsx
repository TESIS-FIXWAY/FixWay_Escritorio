// Componente IndexMecanico:  
// Este componente React sirve como la página de inicio para los usuarios con el rol de Mecánico. 
// Proporciona acceso rápido a diversas funcionalidades a través de tarjetas interactivas y un calendario. 


// Funciones y Características Principales 
// Contiene tarjetas interactivas que permiten navegar a diferentes secciones de la aplicación. 
// Incluye un calendario interactivo para visualizar y gestionar eventos relacionados con el trabajo. 
// Utiliza iconos FontAwesome para mejorar la estética y facilitar la identificación de las funcionalidades. 
// Permite la navegación a las secciones de gestión de mantenciones, listado de usuarios, facturas, listado de facturas, inventario y listado de inventario. 

import '../styles/indexAdmin.css'
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { 
  collection,
  getDocs,
  doc, onSnapshot 
} from 'firebase/firestore';
import Mecanico from './mecanico';

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


const IndexMecanico = () => {
  const navigate = useNavigate();
  const [processCount , setInProcessCount] = useState(0);
  const [pendingCount, setInPendingCount] = useState(0);
  const [deliveredCount, setInDeliveredCount] = useState(0);

  useEffect(() => {
    const fetchMaintenanceCount = async () => {
      try {
        const maintenanceCollection = collection(db, 'mantenciones');
        const maintenanceSnapshot = await getDocs(maintenanceCollection);
    
        const inProcessMaintenance = maintenanceSnapshot.docs.filter(doc => doc.data().estado === 'en proceso');
        const pendingMaintenance = maintenanceSnapshot.docs.filter(doc => doc.data().estado === 'pendiente');
        const deliveredMaintenance = maintenanceSnapshot.docs.filter(doc => doc.data().estado === 'entregados');
    
        const inProcessCount = inProcessMaintenance.length;
        const inPendingCount = pendingMaintenance.length;
        const inDeliveredCount = deliveredMaintenance.length;
    
        setInProcessCount(inProcessCount);
        setInPendingCount(inPendingCount);
        setInDeliveredCount(inDeliveredCount);
      } catch (error) {
        console.error('Error fetching maintenance count:', error);
      }
    };
    
    fetchMaintenanceCount();
  }, []);

  const mantenciones = () => {
    navigate('/gestionMantenciones')
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
      <Mecanico />
      <div className="tabla_listar">
        <div>
          <br />
          <br />
          <br />
          <p>Mantenciones pendientes: {pendingCount}</p>
          <p>Mantenciones en proceso: {processCount}</p>
          <p>Mantenciones Entregadas: {deliveredCount}</p>
        </div>

        <div className='card_admin_calendario'>
          <div className='calendario'>
            <h1 className=''>Calendario</h1>
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
        </div>

        

      </div>
      
    </>
  );
};

export default IndexMecanico;