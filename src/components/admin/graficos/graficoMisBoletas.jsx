import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from "firebase/firestore";
import { createChart } from 'lightweight-charts';
import '../../styles/graficos.css'

const GraficoMisBoletas = () => {
  const chartContainerRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'misBoletas'));
        const boletasPorFecha = {};

        querySnapshot.forEach((doc) => {
          const { fecha } = doc.data();
          if (boletasPorFecha[fecha]) {
            boletasPorFecha[fecha]++;
          } else {
            boletasPorFecha[fecha] = 1;
          }
        });

        const sortedDates = Object.keys(boletasPorFecha).sort((a, b) => {
          const dateA = convertirFecha(a);
          const dateB = convertirFecha(b);
          return dateA - dateB;
        });

        const chartData = sortedDates.map((fecha) => ({ time: convertirFecha(fecha), value: boletasPorFecha[fecha] }));

        setData(chartData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();    
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const chart = createChart(chartContainerRef.current, { width: 800, height: 400 });
      const lineSeries = chart.addLineSeries();
      lineSeries.setData(data);

      const dateFormatter = new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
      chart.applyOptions({
        timeScale: {
          timeVisible: true,
          tickMarkFormatter: (time, tickMarkType, locale) => {
            const date = new Date(time);
            return dateFormatter.format(date);
          }
        }
      });
    }
  }, [data]);

  const convertirFecha = (fecha) => {
    const partes = fecha.split('/');
    const anio = partes[2].length === 4 ? partes[2] : `20${partes[2]}`; // Asume que el año es 20YY si se proporcionan solo 2 dígitos
    return new Date(`${anio}-${partes[1]}-${partes[0]}`).getTime();
  };

  return (
    <div className='grafico-container'>
      <div className='grafico' ref={chartContainerRef}></div>
      <h1 className='titulo-Grafico'>Grafico Mis Boletas</h1>
    </div>
  );
};

export default GraficoMisBoletas;
