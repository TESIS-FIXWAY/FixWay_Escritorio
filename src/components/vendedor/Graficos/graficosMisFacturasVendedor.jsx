import React, { useEffect, useState, useContext } from "react";
import { db } from "../../../dataBase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Chart } from "react-google-charts";
import "../../styles/graficos.css";
import "../../styles/darkMode.css";
import { DarkModeContext } from "../../../context/darkMode";

export default function GraficoMisFacturasVendedor() {
  const [data, setData] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);

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
      title: "Número de Facturas",
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
    color: isDarkMode ? "#B4B4B4" : "#333",
    lineDashStyle: [false],
  };

  return (
    <div className={`grafico-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h1 className={`titulo-Grafico ${isDarkMode ? "dark-mode" : ""}`}>
        Facturas
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
}
