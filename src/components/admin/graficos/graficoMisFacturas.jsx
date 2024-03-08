import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../../firebase';
import {
  collection,
  getDocs,
} from "firebase/firestore";
import Chart from 'chart.js/auto';

const GraficoMisFacturas = () => {
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'misFacturas'));
        let total = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          total += parseFloat(data.total); 
        });
        setTotal(total);
      } catch (error) {
        console.error('Error fetching total:', error);
      }
    };

    fetchTotal();
  }, []);

  useEffect(() => {
    if (total > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total'],
          datasets: [{
            label: 'Total',
            data: [total],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [total]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Total de Facturas</h2>
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
};

export default GraficoMisFacturas;
