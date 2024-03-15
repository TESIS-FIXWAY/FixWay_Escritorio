import React, { useEffect, useRef} from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from "firebase/firestore";
import { createChart } from 'lightweight-charts';

const GraficoMisFacturas = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'misFacturas'));
        const data = [];
        let totalSum = 0; // Variable para almacenar la suma de los totales
        let lastTime = null; // Variable para almacenar la última hora
    
        querySnapshot.forEach((doc) => {
          const { fecha, total } = doc.data(); // Suponiendo que 'fecha' y 'total' son los campos en la colección
          const fechaDate = new Date(fecha);
          const time = fechaDate.getTime(); // Obtener la fecha en milisegundos
          data.push({ time, value: parseFloat(total) });
          totalSum += parseFloat(total); // Sumar al total
          lastTime = time; // Actualizar la última hora
        });
    
        if (lastTime) {
          const lastDate = new Date(lastTime);
          lastDate.setHours(23, 59, 59, 999); // Establecer la última hora del día
          data[data.length - 1].time = lastDate.getTime();
        }

        data.sort((a, b) => a.time - b.time);
    
        const chart = createChart(chartContainerRef.current, { width: 800, height: 400 });
        const lineSeries = chart.addLineSeries();
        lineSeries.setData(data);

        const dateFormatter = new Intl.DateTimeFormat('es-CL', { hour: 'numeric', minute: 'numeric' });
        chart.applyOptions({
          timeScale: {
            timeVisible: true,
            tickMarkFormatter: (time, tickMarkType, locale) => {
              const date = new Date(time * 1000);
              if (date.getHours() === 0 && date.getMinutes() === 0) {
                return date.toLocaleDateString('es-CL');
              } else {
                return dateFormatter.format(date);
              }
            }
          }
        });
        
        console.log('Total de facturas:', totalSum); // Mostrar la suma total en la consola
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();    
  }, []);

  return (
    <>
      <h1>Grafico Mis Facturas</h1>
      <div ref={chartContainerRef}></div>
    </>
  );
};

export default GraficoMisFacturas;

