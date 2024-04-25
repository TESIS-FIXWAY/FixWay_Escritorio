import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from "firebase/firestore";
import Chart from 'chart.js/auto'; // Importa Chart.js
import '../../styles/graficos.css';

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

        const chartData = sortedDates.map((fecha) => ({ x: convertirFecha(fecha), y: boletasPorFecha[fecha] }));

        setData(chartData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();    
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const ctx = chartContainerRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.x),
          datasets: [{
            label: 'Número de boletas',
            data: data.map(item => item.y),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Fecha'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Número de boletas'
              }
            }
          }
        }
      });
    }
  }, [data]);

  const convertirFecha = (fecha) => {
    const partes = fecha.split('/');
    const anio = partes[2].length === 4 ? partes[2] : `20${partes[2]}`; // Asume que el año es 20YY si se proporcionan solo 2 dígitos
    return new Date(`${anio}-${partes[1]}-${partes[0]}`);
  };

  return (
    <div className='grafico-container'>
      <canvas ref={chartContainerRef} className='grafico' width={500} height={500}></canvas>
      <h1 className='titulo-Grafico'>Grafico Mis Boletas</h1>
    </div>
  );
};

export default GraficoMisBoletas;
