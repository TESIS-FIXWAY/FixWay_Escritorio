import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from "firebase/firestore";
import Chart from 'chart.js/auto'; 
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
          labels: obtenerSemanActual(),
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
              },
              ticks: {
                beginAtZero: true,
                stepSize: 5,
                max: 50
              }
            }
          },
          width: 500,
          height: 500
        }
      });
    }
  }, [data]);

  const convertirFecha = (fecha) => {
    const partes = fecha.split('/');
    const anio = partes[2].length === 4 ? partes[2] : `20${partes[2]}`; 
    const fechaFormateada = new Date(`${anio}-${partes[1]}-${partes[0]}`);
    return fechaFormateada.toLocaleDateString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  const obtenerSemanActual = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(firstDayOfWeek);
      nextDay.setDate(firstDayOfWeek.getDate() + i);
      weekDates.push(convertirFecha(nextDay.toLocaleDateString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit' })));
    }

    return weekDates;
  };

  return (
    <div className='grafico-container'>
      <h1 className='titulo-Grafico'>Grafico Mis Boletas</h1>
      <canvas ref={chartContainerRef} className='grafico'></canvas>
    </div>
  );
};

export default GraficoMisBoletas;
