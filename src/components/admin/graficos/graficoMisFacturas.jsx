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
          collection(db, "historialVentas"),
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
      <Chart
        width={"600px"}
        height={"400px"}
        chartType="LineChart"
        loader={<div>Cargando gráfico</div>}
        data={data}
        options={{
          hAxis: {
            title: "Fechas",
          },
          vAxis: {
            title: "Número de facturas",
          },
        }}
      />
    </div>
  );
};

export default GraficoMisFacturas;
