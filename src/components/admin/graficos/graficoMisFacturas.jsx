import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Chart from "chart.js/auto";
import "../../styles/graficos.css";

const GraficoMisFacturas = () => {
  const chartContainerRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "historialVentas"),
          where("tipo", "==", "Factura")
        );
        const querySnapshot = await getDocs(q);
        const facturasPorFecha = {};

        querySnapshot.forEach((doc) => {
          const { fecha } = doc.data();
          if (facturasPorFecha[fecha]) {
            facturasPorFecha[fecha]++;
          } else {
            facturasPorFecha[fecha] = 1;
          }
        });

        const sortedData = Object.keys(facturasPorFecha)
          .map((fecha) => ({ x: fecha, y: facturasPorFecha[fecha] }))
          .sort((a, b) => new Date(b.x) - new Date(a.x));

        setData(sortedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const ctx = chartContainerRef.current.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map((item) => item.x),
          datasets: [
            {
              label: "Número de facturas",
              data: data.map((item) => item.y),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Fechas",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Número de facturas",
              },
            },
          },
        },
        width: 600,
        height: 500,
      });
    }
  }, [data]);

  return (
    <div className="grafico-container">
      <h1 className="titulo-Grafico">Facturas</h1>
      <canvas ref={chartContainerRef} className="grafico"></canvas>
    </div>
  );
};

export default GraficoMisFacturas;
