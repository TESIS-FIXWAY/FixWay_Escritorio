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
    const unsubscribeBoletas = onSnapshot(
      query(collection(db, "misBoletas")),
      (querySnapshot) => {
        const boletasData = querySnapshot.docs.map((doc) => ({
          fecha: doc.data().fecha,
          tipoPago: doc.data().tipoPago,
          totalCompra: Math.max(parseFloat(doc.data().total) || 0, 0),
        }));
        setData((prevData) => [...prevData, ...boletasData]);
        procesarDatos([...data, ...boletasData]);
      },
      (error) => {
        console.error("Error al obtener datos de Firebase:", error);
      }
    );

    const unsubscribeFacturas = onSnapshot(
      query(collection(db, "misFacturas")),
      (querySnapshot) => {
        const facturasData = querySnapshot.docs.map((doc) => ({
          fecha: doc.data().fecha,
          tipoPago: doc.data().tipoPago,
          totalCompra: Math.max(parseFloat(doc.data().total) || 0, 0),
        }));
        setData((prevData) => [...prevData, ...facturasData]);
        procesarDatos([...data, ...facturasData]);
      },
      (error) => {
        console.error("Error al obtener datos de Firebase:", error);
      }
    );

    return () => {
      unsubscribeBoletas();
      unsubscribeFacturas();
    };
  }, [data]);

  const procesarDatos = (data) => {
    const ventasPorMes = agruparPorMes(data);
    entrenarModelo(ventasPorMes);
  };

  const agruparPorMes = (data) => {
    const ventasPorMes = {};

    data.forEach((item) => {
      const [dia, mes, año] = item.fecha.split("/");
      const mesFormateado = `${mes}/${año}`;
      if (!ventasPorMes[mesFormateado]) {
        ventasPorMes[mesFormateado] = { totalCompra: 0 };
      }
      ventasPorMes[mesFormateado].totalCompra += item.totalCompra;
    });

    return Object.keys(ventasPorMes).map((mes) => ({
      mes,
      totalCompra: ventasPorMes[mes].totalCompra,
    }));
  };

  const entrenarModelo = async (ventasPorMes) => {
    try {
      ventasPorMes.sort((a, b) => {
        const [mesA, añoA] = a.mes.split("/").map(Number);
        const [mesB, añoB] = b.mes.split("/").map(Number);
        if (añoA === añoB) return mesA - mesB;
        return añoA - añoB;
      });

      const meses = ventasPorMes.map((item, index) => [index + 1]);
      const totalCompra = ventasPorMes.map((item) => item.totalCompra);

      const inputTensor = tf.tensor2d(meses);
      const labelTensor = tf.tensor2d(totalCompra, [totalCompra.length, 1]);

      // Crear el modelo
      const model = tf.sequential();
      model.add(
        tf.layers.dense({
          units: 10,
          inputShape: [1],
          activation: "relu",
        })
      );
      model.add(
        tf.layers.dense({
          units: 1,
          activation: "relu",
        })
      );

      model.compile({ loss: "meanSquaredError", optimizer: "adam" });

      await model.fit(inputTensor, labelTensor, { epochs: 100, batchSize: 10 });

      const ultimoIndice = meses.length;
      const futureMeses = [];
      for (let i = 1; i <= 12; i++) {
        futureMeses.push([ultimoIndice + i]);
      }

      const futureTensor = tf.tensor2d(futureMeses);
      const predictions = model.predict(futureTensor).arraySync();

      const mesesFuturos = obtenerMesesFuturos(ventasPorMes);

      const predictionsFormatted = predictions.map((pred, index) => {
        const valorPredicho = Math.max(pred[0], 0); // Asegúrate de que el valor sea positivo
        return {
          id: `future-month-${index + 1}`,
          mes: mesesFuturos[index],
          totalCompra: valorPredicho,
          anomaly: valorPredicho > 100000 ? "Anomalía predicha" : "Normal",
        };
      });

      setFuturePredictions(predictionsFormatted);
    } catch (error) {
      console.error("Error al procesar datos con TensorFlow:", error);
    }
  };

  const obtenerMesesFuturos = (ventasPorMes) => {
    const meses = [];
    if (ventasPorMes.length === 0) return meses;

    const ultimoMesAño = ventasPorMes[ventasPorMes.length - 1].mes.split("/");
    let mes = parseInt(ultimoMesAño[0]);
    let año = parseInt(ultimoMesAño[1]);

    for (let i = 1; i <= 12; i++) {
      mes += 1;
      if (mes > 12) {
        mes = 1;
        año += 1;
      }
      meses.push(`${mes}/${año}`);
    }

    return meses;
  };

  const formatearCLP = (numero) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numero);
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
            {futurePredictions.length > 0 ? (
              futurePredictions.map((pred) => (
                <TableRow key={pred.id}>
                  <TableCell>{pred.mes}</TableCell>
                  <TableCell>{formatearCLP(pred.totalCompra)}</TableCell>
                  <TableCell>{pred.anomaly}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay predicciones disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BoletasFacturasIA;
