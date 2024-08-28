import React, { useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../dataBase/firebase";
import { DarkModeContext } from "../../../context/darkMode";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const HistorialVentasIA = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [prediccionesPago, setPrediccionesPago] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "historialVentas")),
      (querySnapshot) => {
        const ventasData = querySnapshot.docs.map((doc) => ({
          fecha: doc.data().fecha,
          tipoPago: doc.data().tipoPago,
          totalCompra: doc.data().totalCompra,
        }));
        procesarDatos(ventasData);
      }
    );

    return () => unsubscribe();
  }, []);

  const procesarDatos = (ventasData) => {
    const ventasPorMes = agruparPorMes(ventasData);
    entrenarModelo(ventasPorMes);
  };

  const agruparPorMes = (ventasData) => {
    const ventasPorMes = {};

    ventasData.forEach((venta) => {
      const mes = venta.fecha.slice(3, 10);
      if (!ventasPorMes[mes]) {
        ventasPorMes[mes] = { credito: 0, contado: 0, debito: 0 };
      }
      if (venta.tipoPago === "credito") {
        ventasPorMes[mes].credito += 1;
      } else if (venta.tipoPago === "contado") {
        ventasPorMes[mes].contado += 1;
      } else if (venta.tipoPago === "debito") {
        ventasPorMes[mes].debito += 1;
      }
    });

    return Object.keys(ventasPorMes).map((mes) => ({
      mes,
      credito: ventasPorMes[mes].credito,
      contado: ventasPorMes[mes].contado,
      debito: ventasPorMes[mes].debito,
    }));
  };

  const entrenarModelo = async (ventasPorMes) => {
    try {
      const meses = ventasPorMes.map((venta) => [
        parseInt(venta.mes.slice(0, 2)),
      ]);
      const credito = ventasPorMes.map((venta) => venta.credito);
      const contado = ventasPorMes.map((venta) => venta.contado);
      const debito = ventasPorMes.map((venta) => venta.debito);

      const inputTensor = tf.tensor2d(meses);
      const targetTensor = tf.tensor2d(
        ventasPorMes.map((venta) => [
          venta.credito,
          venta.contado,
          venta.debito,
        ]),
        [ventasPorMes.length, 3]
      );

      const model = tf.sequential();
      model.add(
        tf.layers.dense({ units: 10, inputShape: [1], activation: "relu" })
      );
      model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

      model.compile({ loss: "categoricalCrossentropy", optimizer: "adam" });

      await model.fit(inputTensor, targetTensor, { epochs: 10 });

      const futureMeses = tf.tensor2d([
        [8],
        [9],
        [10],
        [11],
        [12],
        [1],
        [2],
        [3],
        [4],
        [5],
        [6],
        [7],
        [8],
        [9],
        [10],
        [11],
        [12],
      ]);
      const predictions = model.predict(futureMeses).arraySync();

      setPrediccionesPago(predictions);
    } catch (error) {
      console.error("Error processing data with TensorFlow:", error);
    }
  };

  const obtenerMeses = () => {
    const meses = [];
    let año = 24; // Comenzamos en el año 2024
    for (let i = 8; i <= 12; i++) {
      meses.push(`${i}/${año}`);
    }
    año = 25; // Cambiamos al año 2025
    for (let i = 1; i <= 12; i++) {
      meses.push(`${i}/${año}`);
    }
    return meses;
  };

  return (
    <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
        <h2>Predicción del Tipo de Pago por Mes</h2>
      </div>
      <TableContainer
        className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mes</TableCell>
              <TableCell>Predicción Crédito</TableCell>
              <TableCell>Predicción Contado</TableCell>
              <TableCell>Predicción Débito</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prediccionesPago.map((pred, index) => (
              <TableRow key={index}>
                <TableCell>{obtenerMeses()[index]}</TableCell>{" "}
                <TableCell>{(pred[0] * 100).toFixed(2)}%</TableCell>{" "}
                {/* Probabilidad de Crédito */}
                <TableCell>{(pred[1] * 100).toFixed(2)}%</TableCell>{" "}
                {/* Probabilidad de Contado */}
                <TableCell>{(pred[2] * 100).toFixed(2)}%</TableCell>{" "}
                {/* Probabilidad de Débito */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default HistorialVentasIA;
