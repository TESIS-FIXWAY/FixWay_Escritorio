import React, { useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs";
import { DarkModeContext } from "../../../context/darkMode";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const TensorflowModel = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [inventario, setInventario] = useState([]);
  const [productoMasVendido, setProductoMasVendido] = useState(null);
  const [diasParaReponer, setDiasParaReponer] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "inventario")),
      (querySnapshot) => {
        const inventarioData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventario(inventarioData);

        encontrarProductoMasVendido(inventarioData);
      },
      (error) => {
        console.error("Error fetching inventory data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const encontrarProductoMasVendido = (inventario) => {
    return inventario.reduce(
      (max, item) => (item.cantidadVendida > max.cantidadVendida ? item : max),
      inventario[0]
    );
  };

  const predecirDiasParaReponer = async (producto) => {
    try {
      // Verificar y limpiar los datos
      const data = inventario
        .map((item) => ({
          cantidadVendida: parseFloat(item.cantidadVendida),
          cantidad: parseFloat(item.cantidad),
          diasEnStock: parseFloat(item.diasEnStock),
        }))
        .filter(
          (item) =>
            !isNaN(item.cantidadVendida) &&
            !isNaN(item.cantidad) &&
            !isNaN(item.diasEnStock)
        );

      if (data.length === 0) {
        console.error("No hay datos válidos para entrenar el modelo.");
        return;
      }

      // Normalizar los datos (opcional pero recomendado)
      const maxCantidadVendida = Math.max(
        ...data.map((item) => item.cantidadVendida)
      );
      const maxCantidad = Math.max(...data.map((item) => item.cantidad));
      const maxDiasEnStock = Math.max(...data.map((item) => item.diasEnStock));

      const normalizedData = data.map((item) => ({
        cantidadVendida: item.cantidadVendida / maxCantidadVendida,
        cantidad: item.cantidad / maxCantidad,
        diasEnStock: item.diasEnStock / maxDiasEnStock,
      }));

      // Creación del tensor de entrada con forma explícita [número de filas, número de características]
      const inputTensor = tf.tensor2d(
        normalizedData.map((item) => [
          item.cantidadVendida,
          item.cantidad,
          item.diasEnStock,
        ]),
        [normalizedData.length, 3]
      );

      const targetTensor = tf.tensor2d(
        normalizedData.map((item) => [item.cantidad]),
        [normalizedData.length, 1]
      );

      const model = tf.sequential();
      model.add(
        tf.layers.dense({ units: 10, inputShape: [3], activation: "relu" })
      );
      model.add(tf.layers.dense({ units: 1, activation: "linear" }));

      model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

      await model.fit(inputTensor, targetTensor, { epochs: 10 });

      // Normalizar los valores del producto más vendido para predecir
      const normalizedProduct = {
        cantidadVendida: producto.cantidadVendida / maxCantidadVendida,
        cantidad: producto.cantidad / maxCantidad,
        diasEnStock: producto.diasEnStock / maxDiasEnStock,
      };

      // Hacer predicción con el producto más vendido
      const prediction = model
        .predict(
          tf.tensor2d(
            [
              [
                normalizedProduct.cantidadVendida,
                normalizedProduct.cantidad,
                normalizedProduct.diasEnStock,
              ],
            ],
            [1, 3]
          )
        )
        .dataSync();

      // Desnormalizar la predicción si es necesario
      const diasEstimados = prediction[0] * maxDiasEnStock;
      setDiasParaReponer(diasEstimados);
    } catch (error) {
      console.error("Error processing data with TensorFlow:", error);
    }
  };

  return (
    <>
      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <h2>Recomendación por Producto Más Vendido</h2>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad Actual</TableCell>
                <TableCell>Cantidad Vendida</TableCell>
                <TableCell>Predicción (Días para Reponer)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productoMasVendido ? (
                <TableRow key={productoMasVendido.id}>
                  <TableCell>{productoMasVendido.nombreProducto}</TableCell>
                  <TableCell>{productoMasVendido.cantidad}</TableCell>
                  <TableCell>{productoMasVendido.cantidadVendida}</TableCell>
                  <TableCell>
                    {diasParaReponer !== null
                      ? `${Math.round(diasParaReponer)} días`
                      : "Calculando..."}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default TensorflowModel;
