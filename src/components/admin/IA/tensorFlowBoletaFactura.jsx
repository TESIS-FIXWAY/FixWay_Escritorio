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

const BoletasFacturasIA = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [futurePredictions, setFuturePredictions] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "misBoletas")),
      (querySnapshot) => {
        const boletasData = querySnapshot.docs.map((doc) => ({
          fecha: doc.data().fecha,
          tipoPago: doc.data().tipoPago,
          totalCompra: parseFloat(doc.data().total) || 0,
        }));
        setData(boletasData);
        procesarDatos(boletasData);
      }
    );

    return () => unsubscribe();
  }, []);

  const procesarDatos = (data) => {
    const ventasPorMes = agruparPorMes(data);
    entrenarModelo(ventasPorMes);
  };

  const agruparPorMes = (data) => {
    const ventasPorMes = {};

    data.forEach((item) => {
      const mes = item.fecha.slice(3, 10);
      if (!ventasPorMes[mes]) {
        ventasPorMes[mes] = { totalCompra: 0 };
      }
      ventasPorMes[mes].totalCompra += item.totalCompra;
    });

    return Object.keys(ventasPorMes).map((mes) => ({
      mes,
      totalCompra: ventasPorMes[mes].totalCompra,
    }));
  };

  const entrenarModelo = async (ventasPorMes) => {
    try {
      const meses = ventasPorMes.map((item) => [
        parseInt(item.mes.slice(0, 2)),
      ]);
      const totalCompra = ventasPorMes.map((item) => item.totalCompra);

      const inputTensor = tf.tensor2d(meses);
      const targetTensor = tf.tensor2d(totalCompra, [totalCompra.length, 1]);

      const model = tf.sequential();
      model.add(
        tf.layers.dense({ units: 10, inputShape: [1], activation: "relu" })
      );
      model.add(tf.layers.dense({ units: 1 }));

      model.compile({ loss: "meanSquaredError", optimizer: "adam" });

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
      ]);
      const predictions = model.predict(futureMeses).arraySync();

      setFuturePredictions(
        predictions.map((pred, index) => ({
          id: `future-month-${index + 1}`,
          mes: obtenerMeses()[index],
          totalCompra: pred[0] || 0,
          anomaly: pred[0] > 100000 ? "Anomalía predicha" : "Normal",
        }))
      );
    } catch (error) {
      console.error("Error processing data with TensorFlow:", error);
    }
  };

  const obtenerMeses = () => {
    const meses = [];
    let año = 24;
    for (let i = 8; i <= 12; i++) {
      meses.push(`${i}/${año}`);
    }
    año = 25;
    for (let i = 1; i <= 12; i++) {
      meses.push(`${i}/${año}`);
    }
    return meses;
  };

  return (
    <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
        <h2>Predicción de Ventas Futuras</h2>
      </div>
      <TableContainer
        className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mes</TableCell>
              <TableCell>Total Compra</TableCell>
              <TableCell>Predicción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {futurePredictions.map((pred, index) => (
              <TableRow key={index}>
                <TableCell>{pred.mes}</TableCell>
                <TableCell>${pred.totalCompra.toFixed(2)}</TableCell>
                <TableCell>{pred.anomaly}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BoletasFacturasIA;
