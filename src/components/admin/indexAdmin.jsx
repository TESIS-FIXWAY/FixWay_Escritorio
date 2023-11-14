import '../styles/indexAdmin.css';
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import Admin from "./admin";
import { db } from '../../firebase';
import { createChart } from 'lightweight-charts';
import { 
  collection,
  getDocs,
  doc
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
  
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mantencionRef = collection(db, 'mantencion');
        const snapshot = await getDocs(mantencionRef);

        // Extracting types of maintenance and timestamps from the fetched data
        const maintenanceData = snapshot.docs.map((doc) => ({
          tipoMantencion: doc.data().tipoMantencion,
          timestamp: doc.data().timestamp?.toDate(),
        }));

        // Count occurrences of each type of maintenance and organize by timestamp
        const countsByTimestamp = {};
        maintenanceData.forEach(({ tipoMantencion, timestamp }) => {
          if (timestamp instanceof Date) {
            const timestampKey = timestamp.getTime(); // Use timestamp as the key
            countsByTimestamp[timestampKey] = countsByTimestamp[timestampKey] || {};
            countsByTimestamp[timestampKey][tipoMantencion] =
              (countsByTimestamp[timestampKey][tipoMantencion] || 0) + 1;
          }
        });

        // Convert counts to chart data format
        const chartData = Object.keys(countsByTimestamp).map((timestampKey) => {
          const timestamp = new Date(parseInt(timestampKey, 10));
          const counts = countsByTimestamp[timestampKey];
          return {
            time: timestamp,
            ...counts,
          };
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data from "mantencion" collection:', error);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    const chart = createChart(document.getElementById('chart'), { width: 600, height: 300 });
    const lineSeries = chart.addLineSeries();

    // Set the data for the line chart
    lineSeries.setData(data);

    return () => {
      chart.remove();
    };
  }, [data]);
  
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

        <div className='grafico_barras'>
          <h2>Rendimiento de Mantenciones</h2>
          <div id="chart"></div>
        </div>

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