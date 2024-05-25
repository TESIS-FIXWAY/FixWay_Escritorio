import React, { useState, useEffect } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";
import "../styles/gestionMantenciones.css";

const GestionMantencionesAdmin = () => {
  const [beginTask, setBeginTask] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [users, setUsers] = useState({});

  const calculateContainerHeight = (tasks) => {
    return tasks.length === 0 ? "200px" : `${tasks.length * 40}px`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mantencionesCollection = collection(db, "mantenciones");
        const q = query(mantencionesCollection);

        const unsubscribeMantenciones = onSnapshot(q, (querySnapshot) => {
          const allTasksData = [];

          querySnapshot.forEach((doc) => {
            const task = {
              id: doc.id,
              ...doc.data(),
              estado: doc.data().estado,
            };
            allTasksData.push(task);
          });

          const sortedTasks = {
            pendiente: [],
            "en proceso": [],
            terminado: [],
          };

          allTasksData.forEach((task) => {
            sortedTasks[task.estado].push(task);
          });

          setBeginTask(sortedTasks["pendiente"]);
          setInProgressTasks(sortedTasks["en proceso"]);
          setCompletedTasks(sortedTasks["terminado"]);
        });

        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = {};
        usersSnapshot.forEach((doc) => {
          usersData[doc.id] = doc.data();
        });

        setUsers(usersData);

        return () => unsubscribeMantenciones();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTaskExpand = (taskId) => {
    setExpandedTask((prevExpandedTask) =>
      prevExpandedTask === taskId ? null : taskId
    );
  };

  const getUserName = (userId) => {
    const user = users[userId];
    return user ? `${user.nombre} ${user.apellido}` : "Desconocido";
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Admin />
      <div>
        <div className="container_mantencion_titulo">
          <h1>Gestión de Mantenciones</h1>
        </div>
        <div className="container_mantencion">
          <div className="container_mantencion_tareas">
            <div className="container_mantencion_tareas_titulos">
              <h2>Tareas por hacer</h2>
            </div>
            <ul style={{ height: calculateContainerHeight(beginTask) }}>
              {beginTask.map((task) => (
                <div
                  key={task.id}
                  className={`task-container ${
                    expandedTask === task.id ? "expanded" : ""
                  }`}
                  onClick={() => handleTaskExpand(task.id)}
                >
                  <li>Patente: {task.id}</li>
                  <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                  <li>Descripción: {task.descripcion}</li>
                  <li>Kilometro de Mantención: {task.kilometrajeMantencion}</li>
                  <li>
                    Producto:{" "}
                    {task.productos.map((producto, index) => (
                      <p> - {producto.nombreProducto}</p>
                    ))}
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <div className="container_mantencion_tareas">
            <div className="container_mantencion_tareas_titulos">
              <h2>Tareas en Proceso</h2>
            </div>
            <ul style={{ height: calculateContainerHeight(inProgressTasks) }}>
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-container ${
                    expandedTask === task.id ? "expanded" : ""
                  }`}
                  onClick={() => handleTaskExpand(task.id)}
                >
                  <li>Patente: {task.id}</li>
                  <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                  <li>Descripción: {task.descripcion}</li>
                  <li>Kilometro de Mantención: {task.kilometrajeMantencion}</li>
                  <li>Persona a Cargo: {getUserName(task.personaTomadora)}</li>
                  <li>
                    Producto:{" "}
                    {task.productos.map((producto, index) => (
                      <p> - {producto.nombreProducto}</p>
                    ))}
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <div className="container_mantencion_tareas">
            <div className="container_mantencion_tareas_titulos">
              <h2>Tareas Entregadas</h2>
            </div>
            <ul style={{ height: calculateContainerHeight(completedTasks) }}>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-container ${
                    expandedTask === task.id ? "expanded" : ""
                  }`}
                >
                  <li>Patente: {task.id}</li>
                  <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                  <li>Descripción: {task.descripcion}</li>
                  <li>Kilometro de Mantención: {task.kilometrajeMantencion}</li>
                  <li>
                    Producto:{" "}
                    {task.productos.map((producto, index) => (
                      <p> - {producto.nombreProducto}</p>
                    ))}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default GestionMantencionesAdmin;
