import Admin from "../admin";
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
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [productosBajaDemanda, setProductosBajaDemanda] = useState([]);
  const [productosAltaDemanda, setProductosAltaDemanda] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "inventario")),
      (querySnapshot) => {
        const inventarioData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventario(inventarioData);

        procesarDatosConTensorFlow(inventarioData);
      },
      (error) => {
        console.error("Error fetching inventory data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const procesarDatosConTensorFlow = async (inventarioData) => {
    try {
      // Normalizar y estructurar los datos para TensorFlow
      const data = inventarioData.map((item) => ({
        cantidad: parseFloat(item.cantidad),
        costo: parseFloat(item.costo),
        anoProductoUsoFin: parseFloat(item.anoProductoUsoFin),
        anoProductoUsoInicio: parseFloat(item.anoProductoUsoInicio),
      }));

      // Convertir los datos en tensores
      const inputTensor = tf.tensor2d(
        data.map((item) => [
          item.cantidad,
          item.costo,
          item.anoProductoUsoFin,
          item.anoProductoUsoInicio,
        ])
      );

      // Usar la misma entrada como target (etiqueta)
      const targetTensor = inputTensor.clone();

      // Crear un modelo simple de predicción
      const model = tf.sequential();
      model.add(
        tf.layers.dense({ units: 10, inputShape: [4], activation: "relu" })
      );
      model.add(tf.layers.dense({ units: 4, activation: "linear" })); // Cambié units a 4 para que coincida con el número de características

      model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

      // Entrenar el modelo
      await model.fit(inputTensor, targetTensor, { epochs: 10 });

      // Predecir recomendaciones
      const predictions = model.predict(inputTensor).dataSync();

      // Filtrar las recomendaciones basadas en las predicciones
      const productosAgotandose = inventarioData.filter(
        (item, index) => predictions[index * 4] <= 10
      );
      const productosBaja = inventarioData.filter(
        (item, index) => predictions[index * 4] > 50
      );
      const productosAlta = inventarioData.filter(
        (item, index) => predictions[index * 4] < 20
      );

      setRecomendaciones(productosAgotandose);
      setProductosBajaDemanda(productosBaja);
      setProductosAltaDemanda(productosAlta);
    } catch (error) {
      console.error("Error processing data with TensorFlow:", error);
    }
  };

  return (
    <>
      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <h2>Recomendaciones de Stock</h2>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad Actual</TableCell>
                <TableCell>Recomendación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recomendaciones.length > 0 ? (
                recomendaciones.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.nombreProducto}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    <TableCell>Reponer Stock</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hay recomendaciones en este momento
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <h2>Productos de Baja Demanda</h2>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad Actual</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosBajaDemanda.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.nombreProducto}</TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <h2>Productos de Alta Demanda</h2>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad Actual</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productosAltaDemanda.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell>{producto.nombreProducto}</TableCell>
                  <TableCell>{producto.cantidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default TensorflowModel;
