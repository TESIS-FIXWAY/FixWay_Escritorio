import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Chart } from "react-google-charts";
import "../../styles/graficos.css";

const GraficoMisFacturas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "misFacturas"),
          where("tipo", "==", "Factura")
        );
        const querySnapshot = await getDocs(q);
        const facturasPorFecha = {};

        querySnapshot.forEach((doc) => {
          const { fecha } = doc.data();
          if (fecha) {
            if (facturasPorFecha[fecha]) {
              facturasPorFecha[fecha]++;
            } else {
              facturasPorFecha[fecha] = 1;
            }
          }
        });

        const sortedData = Object.keys(facturasPorFecha)
          .map((fecha) => [fecha, facturasPorFecha[fecha]])
          .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        setData([["Fechas", "Número de facturas"], ...sortedData]);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grafico-container">
      <h1 className="titulo-Grafico">Facturas</h1>
      <div className="grafico">
        <Chart
          width={"100%"}
          height={"330px"}
          chartType="LineChart"
          loader={<div>Cargando gráfico</div>}
          data={data}
          options={{
            hAxis: {
              title: "Fechas",
              textStyle: {
                color: "#333",
                fontSize: 12,
                fontName: "Arial",
              },
              titleTextStyle: {
                color: "#333",
                fontSize: 14,
                bold: true,
                italic: false,
              },
            },
            vAxis: {
              title: "Número de Facturas",
              textStyle: {
                color: "#333",
                fontSize: 12,
                fontName: "Arial",
              },
              titleTextStyle: {
                color: "#333",
                fontSize: 14,
                bold: true,
                italic: false,
              },
            },
            lineWidth: 3,
            backgroundColor: "fff", // Asegúrate de que el fondo sea transparente
            chartArea: {
              width: "85%", // Ajusta según tus necesidades
              height: "70%", // Ajusta según tus necesidades
              backgroundColor: "fff",
            },
            legend: {
              textStyle: {
                color: "#333",
                fontSize: 12,
                fontName: "Arial",
              },
            },
            pointSize: 10,
            lineDashStyle: [false],
          }}
        />
      </div>
    </div>
  );
};

export default GraficoMisFacturas;
