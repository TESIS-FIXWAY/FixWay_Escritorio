import React, { useEffect, useState, useContext } from "react";
import { db } from "../../../dataBase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Chart } from "react-google-charts";
import "../../styles/graficos.css";
import "../../styles/darkMode.css";
import { DarkModeContext } from "../../../context/darkMode";

const GraficoMisBoletas = () => {
  const [data, setData] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "misBoletas"),
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

  const chartOptions = {
    hAxis: {
      title: "Fechas",
      textStyle: {
        color: isDarkMode ? "#e0e0e0" : "#333",
        fontSize: 12,
        fontName: "Arial",
      },
      titleTextStyle: {
        color: isDarkMode ? "#e0e0e0" : "#333",
        fontSize: 14,
        bold: true,
        italic: false,
      },
    },
    vAxis: {
      title: "Número de Boletas",
      textStyle: {
        color: isDarkMode ? "#B4B4B4" : "#333",
        fontSize: 12,
        fontName: "Arial",
      },
      titleTextStyle: {
        color: isDarkMode ? "#B4B4B4" : "#333",
        fontSize: 14,
        bold: true,
        italic: false,
      },
    },
    lineWidth: 3,
    pointSize: 5,
    colors: [isDarkMode ? "#818284" : "#92AEE4"],
    backgroundColor: isDarkMode ? "#333" : "#fff",
    chartArea: {
      width: "85%",
      height: "70%",
      backgroundColor: isDarkMode ? "" : "#fff",
    },
    legend: {
      textStyle: {
        color: isDarkMode ? "#B4B4B4" : "#333",
        fontSize: 12,
        fontName: "Arial",
      },
    },
    pointSize: 5,
    color: isDarkMode ? "#B4B4B4" : "#333",
    lineDashStyle: [false],
  };

  return (
    <div className={`grafico-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h1 className={`titulo-Grafico ${isDarkMode ? "dark-mode" : ""}`}>
        Boletas
      </h1>
      <div className={`grafico ${isDarkMode ? "dark-mode" : ""}`}>
        <Chart
          width={"100%"}
          height={"330px"}
          chartType="LineChart"
          loader={<div>Cargando gráfico</div>}
          data={data}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default GraficoMisBoletas;
