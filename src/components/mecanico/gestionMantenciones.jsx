import React, { useState, useEffect } from "react";
import Mecanico from "./mecanico";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

const GestionMantenciones = () => {
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const mantencionesCollection = collection(db, "mantenciones");
      const q = query(mantencionesCollection);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allTasksData = [];

        querySnapshot.forEach((doc) => {
          const task = { id: doc.id, ...doc.data(), estado: "Por hacer" };
          allTasksData.push(task);
        });

        setTodoTasks(allTasksData);
        setInProgressTasks([]); // Clear other columns initially
        setCompletedTasks([]); // Clear other columns initially
      });

      return () => unsubscribe();
    };

    fetchData();
  }, []); 

  return (
    <>
      <Mecanico />
      <div className="container-form">
        <div className="informacion">
          <div className="info">
            <h1>Gestión de Mantenciones</h1>
          </div>
          <div className="task-board">
            <div className="task-column">
              <h2>Tareas por hacer</h2>
              <ul>
                {todoTasks.map((task) => (
                  <li key={task.id}>{task.descripcion}</li>
                ))}
              </ul>
            </div>
            <div className="task-column">
              <h2>Tareas en proceso</h2>
              <ul>
                {inProgressTasks.map((task) => (
                  <li key={task.id}>{task.descripcion}</li>
                ))}
              </ul>
            </div>
            <div className="task-column">
              <h2>Finalizadas</h2>
              <ul>
                {completedTasks.map((task) => (
                  <li key={task.id}>{task.descripcion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GestionMantenciones;