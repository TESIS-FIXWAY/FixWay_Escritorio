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
        let totalSum = 0; // Variable para almacenar la suma de los totales
        const data = [];
        let increment = 0;

        querySnapshot.forEach((doc) => {
          const { fecha, total } = doc.data(); // Suponiendo que 'fecha' y 'total' son los campos en la colección
          const fechaParts = fecha.split('/'); // Suponiendo que la fecha está en formato 'DD/MM/AAAA'
          const fechaKey = `${fechaParts[2]}-${fechaParts[1]}-${fechaParts[0]}`;
          const time = new Date(fechaKey).getTime() + increment; // Añadir un incremento fijo
          data.push({ time, value: parseFloat(total) });
          totalSum *= parseFloat(total);
          increment++; // Incrementar el valor para el próximo documento
        });

        data.sort((a, b) => a.time - b.time);

        const chart = createChart(chartContainerRef.current, { width: 800, height: 400 });
        const lineSeries = chart.addLineSeries();
        lineSeries.setData(data);

        const dateFormatter = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit' });
        chart.applyOptions({
          timeScale: {
            timeVisible: true,
            tickMarkFormatter: (time, tickMarkType, locale) => {
              const date = new Date(time);
              return dateFormatter.format(date);
            }
          }
        });

        console.log('Total de totales Facturas:', totalSum);
        console.log('Total de Facturas por día:', data); // Mostrar el total por día en la consola
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

