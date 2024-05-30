import React, { useState, useEffect, useContext } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";

import { DarkModeContext } from "../../context/darkMode";

import "../styles/gestionMantenciones.css";
import "../styles/darkMode.css";

const GestionMantencionesAdmin = () => {
  const [beginTask, setBeginTask] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [users, setUsers] = useState({});
  const { isDarkMode } = useContext(DarkModeContext);

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
    setExpandedTasks((prevExpandedTasks) => {
      if (prevExpandedTasks.includes(taskId)) {
        return prevExpandedTasks.filter((id) => id !== taskId);
      } else {
        return [...prevExpandedTasks, taskId];
      }
    });
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
      <div className={`grid ${isDarkMode ? "dark-mode" : ""}`}>
        <header> <Admin /> </header>

        <aside className={`sidebar_left ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`contenedor_mantencion ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`titulo_mantencion ${isDarkMode ? "dark-mode" : ""}`}>pendientes</div>
            <div className={`mantencion ${isDarkMode ? "dark-mode" : ""}`}>

              <ul >
                {beginTask.map((task) => (
                  <div
                    key={task.id}
                    className={`task-container ${
                      expandedTasks.includes(task.id) ? "expanded" : ""
                    }`}
                    onClick={() => handleTaskExpand(task.id)}
                  >
                    <li>Patente: {task.id}</li>
                    <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                    {/* Mostrar más información solo si la tarea está expandida */}
                    {expandedTasks.includes(task.id) && (
                      <>
                        <li>Descripción: {task.descripcion}</li>
                        <li>Kilometro de Mantención: {task.kilometrajeMantencion}</li>
                        <li>Persona a Cargo: {getUserName(task.personaTomadora)}</li>
                        <li>
                          Producto:{" "}
                          {task.productos.map((producto, index) => (
                            <p key={index}> - {producto.nombreProducto}</p>
                          ))}
                        </li>
                      </>
                    )}
                  </div>
                ))}
              </ul>

            </div>
          </div>
        </aside>

        <aside className={`sidebar_centro ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`contenedor_mantencion ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`titulo_mantencion ${isDarkMode ? "dark-mode" : ""}`}>En Proceso</div>

            <div className="mantencion">

                <ul className="lista_mantencion">
                  {inProgressTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-container ${
                        expandedTasks.includes(task.id) ? "expanded" : ""
                      }`}
                      onClick={() => handleTaskExpand(task.id)}
                    >
                      <li>Patente: {task.id}</li>
                      <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                      {/* Mostrar más información solo si la tarea está expandida */}
                      {expandedTasks.includes(task.id) && (
                        <>
                          <li>Descripción: {task.descripcion}</li>
                          <li>Kilometro de Mantención: {task.kilometrajeMantencion}</li>
                          <li>Persona a Cargo: {getUserName(task.personaTomadora)}</li>
                          <li>
                            Producto:{" "}
                            {task.productos.map((producto, index) => (
                              <p key={index}> - {producto.nombreProducto}</p>
                            ))}
                          </li>
                        </>
                      )}
                    </div>
                  ))}
                </ul>

            </div>
          </div>
        </aside>

        <aside className={`sidebar_rigth ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`contenedor_mantencion ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`titulo_mantencion ${isDarkMode ? "dark-mode" : ""}`}>Terminadas</div>

            <div className="mantencion">

              <ul className="lista_mantencion">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-container ${
                      expandedTasks.includes(task.id) ? "expanded" : ""
                    }`}
                    onClick={() => handleTaskExpand(task.id)}
                  >
                    <li>Patente: {task.id}</li>
                    <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                    {/* Mostrar más información solo si la tarea está expandida */}
                    {expandedTasks.includes(task.id) && (
                      <>
                        <li>Descripción: {task.descripcion}</li>
                        <li>Kilometro de Mantención: {task.kilometrajeMantencion}</li>
                        <li>Persona a Cargo: {getUserName(task.personaTomadora)}</li>
                        <li>
                          Producto:{" "}
                          {task.productos.map((producto, index) => (
                            <p key={index}> - {producto.nombreProducto}</p>
                          ))}
                        </li>
                      </>
                    )}
                  </div>
                ))}
              </ul>

            </div>
          </div>        
        </aside>

      </div>
    </>
  );
};

export default GestionMantencionesAdmin;




      {/* <Admin />
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
      </div> */}