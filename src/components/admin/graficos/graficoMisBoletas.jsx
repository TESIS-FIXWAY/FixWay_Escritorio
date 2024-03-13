import React, { useEffect, useRef } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from "firebase/firestore";
import { createChart } from 'lightweight-charts';

const GraficoMisBoletas = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'misBoletas'));
        const data = [];
        querySnapshot.forEach((doc) => {
          const { fecha, time, total } = doc.data(); // Suponiendo que 'fecha', 'time' y 'total' son los campos en la colección
          const fechaDate = new Date(fecha);
          data.push({ fecha: fechaDate, time, total: parseFloat(total) });
        });

        // Ordenar los datos por tiempo (fecha)
        data.sort((a, b) => a.time - b.time);

        const chart = createChart(chartContainerRef.current, { width: 800, height: 400 });
        const lineSeries = chart.addLineSeries();
        lineSeries.setData(data.map(({ fecha, total }) => ({ time: fecha.getTime(), value: total })));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Grafico Mis Boletas</h1>
      <div ref={chartContainerRef}></div>
    </>
  );
};

export default GraficoMisBoletas;

