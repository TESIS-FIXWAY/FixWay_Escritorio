import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../../context/darkMode";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../dataBase/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import * as tf from "@tensorflow/tfjs";

const InventarioIA = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [inventario, setInventario] = useState([]);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [ventasPrediccion, setVentasPrediccion] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "inventario")),
      (querySnapshot) => {
        const inventarioData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventario(inventarioData);
        calcularVentasMensuales(inventarioData);
      },
      (error) => {
        console.error("Error fetching inventory data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const calcularVentasMensuales = (inventario) => {
    const ventasPorMes = {};

    inventario.forEach((item) => {
      const fechaVenta = new Date(item.fechaVenta);
      const mes = format(fechaVenta, "yyyy-MM");

      if (!ventasPorMes[mes]) {
        ventasPorMes[mes] = 0;
      }
      ventasPorMes[mes] += item.cantidadVendida;
    });

    const ventasArray = Object.entries(ventasPorMes).map(([mes, ventas]) => ({
      mes,
      ventas,
    }));

    setVentasMensuales(ventasArray);

    entrenarModelo(ventasArray);
  };

  const entrenarModelo = async (ventasData) => {
    const xs = ventasData.map((_, idx) => idx);
    const ys = ventasData.map((venta) => venta.ventas);
    const inputTensor = tf.tensor2d(xs, [xs.length, 1]);
    const labelTensor = tf.tensor2d(ys, [ys.length, 1]);

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 50, activation: "relu", inputShape: [1] })
    );
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: "adam", loss: "meanSquaredError" });

    await model.fit(inputTensor, labelTensor, {
      epochs: 100,
      batchSize: 10,
    });

    const predicciones = [];
    for (let i = xs.length; i < xs.length + 3; i++) {
      const prediccion = model.predict(tf.tensor2d([i], [1, 1]));
      const valorPrediccion = await prediccion.data();
      predicciones.push(valorPrediccion[0]);
    }

    setVentasPrediccion(predicciones);
  };

  return (
    <>
      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <h2>Ventas por Mes</h2>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mes</TableCell>
                <TableCell>Ventas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventasMensuales.length > 0 ? (
                ventasMensuales.map((venta) => (
                  <TableRow key={venta.mes}>
                    <TableCell>{venta.mes}</TableCell>
                    <TableCell>{venta.ventas}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hay datos de ventas mensuales
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <h2>Predicción de Ventas (Próximos 3 Meses)</h2>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mes Futuro</TableCell>
                <TableCell>Ventas Predichas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventasPrediccion.length > 0 ? (
                ventasPrediccion.map((prediccion, index) => (
                  <TableRow key={index}>
                    <TableCell>{`Mes ${index + 1}`}</TableCell>
                    <TableCell>{prediccion.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hay predicciones disponibles
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

export default InventarioIA;
