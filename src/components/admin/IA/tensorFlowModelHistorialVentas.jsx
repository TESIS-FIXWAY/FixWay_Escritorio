import React, { useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebase";
import { DarkModeContext } from "../../../context/darkMode";

const HistorialVentasIA = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [ventasMensuales, setVentasMensuales] = useState([]);
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

      const futureMeses = tf.tensor2d([[8], [9], [10], [11], [12]]);
      const predictions = model.predict(futureMeses).arraySync();

      setPrediccionesPago(predictions);
    } catch (error) {
      console.error("Error processing data with TensorFlow:", error);
    }
  };

  return (
    <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
      <h2>Predicción del Tipo de Pago por Mes</h2>
      <table>
        <thead>
          <tr>
            <th>Mes</th>
            <th>Predicción Crédito</th>
            <th>Predicción Contado</th>
            <th>Predicción Débito</th>
          </tr>
        </thead>
        <tbody>
          {prediccionesPago.map((pred, index) => (
            <tr key={index}>
              <td>{index + 8}/24</td> <td>{pred[0].toFixed(2)}</td>{" "}
              {/* Probabilidad de Crédito */}
              <td>{pred[1].toFixed(2)}</td> {/* Probabilidad de Contado */}
              <td>{pred[2].toFixed(2)}</td> {/* Probabilidad de Débito */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialVentasIA;
