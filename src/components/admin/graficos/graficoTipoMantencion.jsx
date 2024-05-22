import React, { useEffect, useRef, useState } from "react";
import { db } from "../../../firebase";
import { collection, query, getDocs } from "firebase/firestore";
import Chart from "chart.js/auto";
import "../../styles/graficos.css";

const GraficoTipoPago = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [data, setData] = useState({ debito: 0, credito: 0, contado: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "historialVentas"));
        const querySnapshot = await getDocs(q);
        const tipoPagoCount = { debito: 0, credito: 0, contado: 0 };

        querySnapshot.forEach((doc) => {
          const { tipoPago } = doc.data();
          if (
            tipoPago === "debito" ||
            tipoPago === "credito" ||
            tipoPago === "contado"
          ) {
            tipoPagoCount[tipoPago]++;
          }
        });

        setData(tipoPagoCount);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.values(data).some((count) => count > 0)) {
      const ctx = chartContainerRef.current.getContext("2d");

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Débito", "Crédito", "Contado"],
          datasets: [
            {
              label: "Tipo de Pago",
              data: [data.debito, data.credito, data.contado],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    }
  }, [data]);

  return (
    <div className="grafico-container">
      <h1 className="titulo-GraficoM">Tipo de Pago</h1>
      <canvas ref={chartContainerRef} className="graficoM"></canvas>
    </div>
  );
};

export default GraficoTipoPago;
