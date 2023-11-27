// Este componente IndexAdmin gestiona la interfaz de usuario para la sección de administrador. 
// Proporciona acceso rápido a diversas funcionalidades, como agregar y listar usuarios, gestionar mantenciones, agregar y listar facturas de proveedores, agregar y listar inventario, y generar facturas de vendedores.  
// Utiliza FontAwesome para los iconos y React Router para la navegación. 
// Además, incluye un calendario que permite seleccionar fechas y muestra eventos relacionados. 
// Funciones y características principales: 
// Navegación rápida a través de iconos a diferentes secciones de la aplicación. 
// Utilización de FontAwesome para la visualización de iconos. 
// Calendario interactivo para la selección de fechas. 
// Integración con React Router para la navegación. 
// Acceso a funciones como agregar y listar usuarios, gestionar mantenciones, entre otras. 

import '../styles/indexAdmin.css';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import Admin from "./admin";
import { db, auth } from '../../firebase';
import { createChart } from 'lightweight-charts';
import { 
  collection,
  getDocs,
  doc, onSnapshot 
} from 'firebase/firestore';
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
  faEnvelope,
  faLocationDot,
  faPhone,
  faSpinner,
  faRectangleList,
  faIdCard,
} 
from '@fortawesome/free-solid-svg-icons';
import { faAddressCard, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
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
  faEnvelope,
  faLocationDot,
  faPhone,
  faAddressCard,
  faSpinner,
  faRectangleList,
  faCircleCheck,
  faIdCard
);

const IndexAdmin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [processCount , setInProcessCount] = useState(0);
  const [pendingCount, setInPendingCount] = useState(0);
  const [deliveredCount, setInDeliveredCount] = useState(0);

  useEffect(() => {
    const identifyUser = auth.currentUser;
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        setUser(snapshot.data());
      });
    }
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
  const generarFacturas = () => {
    navigate('/generarFactura')
  }
  const gestionMantenciones = () => {
    navigate('/gestionMantencionesAdmin')
  }

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Admin />
      <div className="tabla_listar">


        <div className='card_admin_encabezado'>
          <div className='card_admin_calendario'>
            <div className='calendario'>
              {/* <h1 className=''>Calendario</h1> */}
              <Calendar onChange={handleDateChange} value={selectedDate} />
            </div>
          </div>
          <div className='perfil_usuario'>
            <h1 className='perfil_usuario_h1'>Perfil de Usuario</h1>
            {user && (
              <div className='perfil_usuario_lista'>
                <p className='perfil_usuario_lista_p'> <FontAwesomeIcon icon="fa-solid fa-user" /> Nombre de Usuario:</p>
                <p className='perfil_usuario_lista_p'>{user.nombre} {user.apellido}</p>
                <p className='perfil_usuario_lista_p'> <FontAwesomeIcon icon="fa-solid fa-id-card" /> RUT de Usuario: </p>
                <p className='perfil_usuario_lista_p'>{user.rut}</p>
                <p className='perfil_usuario_lista_p'> <FontAwesomeIcon icon="fa-solid fa-envelope" /> Correo Electronico:</p>
                <p className='perfil_usuario_lista_p'>{user.email}</p>
                <p className='perfil_usuario_lista_p'> <FontAwesomeIcon icon="fa-solid fa-location-dot" /> Direccion de Usuario:</p>
                <p className='perfil_usuario_lista_p'>{user.direccion}</p>
                <p className='perfil_usuario_lista_p'> <FontAwesomeIcon icon="fa-solid fa-phone" /> Telefono de Usuario:</p>
                <p className='perfil_usuario_lista_p'>{user.telefono}</p>
              </div>
            )}
          </div>
        </div>


        <div className='card_admin_subencabezado'>
          <div className='card_admin_mantencion'>
            <div className='card_admin_mantencion_in'>
              <h1>mantenciones</h1>
              <hr />
              <p className='card_admin_mantencion_p'> <FontAwesomeIcon icon="fa-solid fa-rectangle-list" /> Mantenciones pendientes:</p>
              <p className='card_admin_mantencion_p'>{pendingCount}</p>
              <hr />
              <p className='card_admin_mantencion_p'> <FontAwesomeIcon icon="fa-solid fa-spinner" /> Mantenciones en proceso:</p>
              <p className='card_admin_mantencion_p'>{processCount}</p>
              <hr />
              <p className='card_admin_mantencion_p'> <FontAwesomeIcon icon="fa-regular fa-circle-check" /> Mantenciones Entregadas:</p>
              <p className='card_admin_mantencion_p'>{deliveredCount}</p>
            </div>
          </div>
          <div className='contenedor_cartas_iconos'>
            <div className='cartas_iconos'  onClick={usuarios}>
              <FontAwesomeIcon icon="fa-solid fa-user-plus" className='functionality_icon' />
              <p>Agregar usuario</p>
            </div>
            <div className='cartas_iconos' onClick={listarUsuarios}>
            <FontAwesomeIcon className='functionality_icon' icon="fa-solid fa-users" />
              <p>Listar usuarios</p>
            </div> 
            <div className='cartas_iconos' onClick={gestionMantenciones}>
              <FontAwesomeIcon className='functionality_icon' icon="fa-solid fa-rectangle-list" />              
              <p>Gestion de Mantenciones</p>
            </div>
            <div className='cartas_iconos' onClick={facturas}>
            <FontAwesomeIcon icon="fa-solid fa-file-circle-plus" className='functionality_icon' />
              <p>Agregar factura de proveedores</p>
            </div>  
            <div className='cartas_iconos' onClick={listarFacturas}>
              <FontAwesomeIcon className='functionality_icon' icon="fa-solid fa-clipboard-list" />
              <p>Listar facturas de proveedores</p>
            </div> 
            <div className='cartas_iconos' onClick={inventario}>
              <FontAwesomeIcon className='functionality_icon' icon="fa-solid fa-cart-flatbed" />              
              <p>Agregar inventario</p>
            </div> 
            <div className='cartas_iconos' onClick={listarInventario}>
              <FontAwesomeIcon className='functionality_icon' icon="fa-solid fa-boxes-stacked" />
              <p>Listar inventario</p>
            </div> 
            <div className='cartas_iconos' onClick={generarFacturas}>
              <FontAwesomeIcon className='functionality_icon' icon="fa-solid fa-receipt" />              
              <p>Generar factura de vendedor</p>
            </div> 
          </div>
        </div>

        
      </div>
    </>
  );
};

export default IndexAdmin;