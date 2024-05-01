import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Chart } from "react-google-charts";
import "../../styles/graficos.css";

const GraficoMisBoletas = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "historialVentas"),
          where("tipo", "==", "Boleta")
        );
        const querySnapshot = await getDocs(q);
        const boletasPorFecha = {};

        querySnapshot.forEach((doc) => {
          const { fecha } = doc.data();
          if (fecha) {
            if (boletasPorFecha[fecha]) {
              boletasPorFecha[fecha]++;
            } else {
              boletasPorFecha[fecha] = 1;
            }
          }
        });

        const sortedData = Object.keys(boletasPorFecha)
          .map((fecha) => [fecha, boletasPorFecha[fecha]])
          .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        setData([["Fechas", "Número de boletas"], ...sortedData]);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setData([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grafico-container">
      <h1 className="titulo-Grafico">Boletas</h1>
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
            title: "Número de boletas",
          },
        }}
      />
    </div>
  );
};

export default GraficoMisBoletas;
