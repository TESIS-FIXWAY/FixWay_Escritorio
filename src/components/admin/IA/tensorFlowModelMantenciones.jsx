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

const MantenimientoPredictor = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [mantenciones, setMantenciones] = useState([]);
  const [proximaMantencion, setProximaMantencion] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "mantenciones")),
      (querySnapshot) => {
        const mantencionesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMantenciones(mantencionesData);

        if (mantencionesData.length > 0) {
          predecirProximaMantencion(mantencionesData);
        }
      },
      (error) => {
        console.error("Error fetching maintenance data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const predecirProximaMantencion = async (mantenciones) => {
    try {
      // Filtrar y limpiar datos
      const data = mantenciones
        .map((item) => ({
          kilometrajeMantencion: parseFloat(item.kilometrajeMantencion),
          fecha: new Date(item.fecha).getTime(),
        }))
        .filter(
          (item) => !isNaN(item.kilometrajeMantencion) && !isNaN(item.fecha)
        );

      if (data.length === 0) {
        console.error("No hay datos válidos para entrenar el modelo.");
        return;
      }

      // Normalizar los datos
      const maxKilometraje = Math.max(
        ...data.map((item) => item.kilometrajeMantencion)
      );
      const maxFecha = Math.max(...data.map((item) => item.fecha));

      const normalizedData = data.map((item) => ({
        kilometrajeMantencion: item.kilometrajeMantencion / maxKilometraje,
        fecha: item.fecha / maxFecha,
      }));

      // Crear los tensores de entrada y objetivo
      const inputTensor = tf.tensor2d(
        normalizedData.map((item) => [item.kilometrajeMantencion, item.fecha]),
        [normalizedData.length, 2]
      );

      const targetTensor = tf.tensor2d(
        normalizedData.map((item) => [item.kilometrajeMantencion]),
        [normalizedData.length, 1]
      );

      const model = tf.sequential();
      model.add(
        tf.layers.dense({
          units: 10,
          inputShape: [2],
          activation: "relu",
        })
      );
      model.add(tf.layers.dense({ units: 1, activation: "linear" }));

      model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

      await model.fit(inputTensor, targetTensor, { epochs: 10 });

      // Hacer predicción para la próxima mantención
      const ultimaMantencion = normalizedData[normalizedData.length - 1];
      const prediction = model
        .predict(
          tf.tensor2d(
            [[ultimaMantencion.kilometrajeMantencion, ultimaMantencion.fecha]],
            [1, 2]
          )
        )
        .dataSync();

      const kilometrajeEstimado = prediction[0] * maxKilometraje;
      setProximaMantencion(kilometrajeEstimado);
    } catch (error) {
      console.error("Error processing data with TensorFlow:", error);
    }
  };

  return (
    <>
      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <h2>Próxima Mantención Estimada</h2>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patente</TableCell>
                <TableCell>Último Kilometraje</TableCell>
                <TableCell>Próximo Kilometraje Estimado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proximaMantencion !== null ? (
                <TableRow key={mantenciones[mantenciones.length - 1].id}>
                  <TableCell>
                    {mantenciones[mantenciones.length - 1].patente}
                  </TableCell>
                  <TableCell>
                    {
                      mantenciones[mantenciones.length - 1]
                        .kilometrajeMantencion
                    }
                  </TableCell>
                  <TableCell>{Math.round(proximaMantencion)} km</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Calculando...
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

export default MantenimientoPredictor;
