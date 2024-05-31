import React, { useState, useEffect, useContext } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import Mecanico from "./mecanico";
import { DarkModeContext } from "../../context/darkMode";
import "../styles/gestionMantenciones.css";
import "../styles/darkMode.css";

const GestionMantenciones = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [beginTask, setBeginTask] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    const fetchData = async () => {
      try {
        const unsubscribeMantenciones = onSnapshot(
          collection(db, "mantenciones"),
          (querySnapshot) => {
            const allTasksData = [];
            querySnapshot.forEach((doc) => {
              const task = { id: doc.id, ...doc.data() };
              allTasksData.push(task);
            });

            const sortedTasks = {
              pendiente: [],
              prioridad: [],
              atencion_especial: [],
              "en proceso": [],
              terminado: [],
            };

            allTasksData.forEach((task) => {
              sortedTasks[task.estado].push(task);
            });

            const combinedPendingTasks = [
              ...sortedTasks["pendiente"],
              ...sortedTasks["prioridad"],
              ...sortedTasks["atencion_especial"],
            ];
            setBeginTask(combinedPendingTasks);
            setInProgressTasks(
              sortedTasks["en proceso"].filter(
                (task) => task.personaTomadora === currentUser.uid
              )
            );
            setCompletedTasks(sortedTasks["terminado"]);
          }
        );

        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = {};
        usersSnapshot.forEach((doc) => {
          usersData[doc.id] = doc.data();
        });
        setUsers(usersData);

        return () => {
          unsubscribeMantenciones();
          unsubscribeAuth();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentUser]);

  const updateTaskStatus = async (task, newStatus) => {
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    const taskRef = doc(db, "mantenciones", task.id);

    try {
      await updateDoc(taskRef, {
        estado: newStatus,
        personaTomadora: currentUser.uid,
      });

      const removeFrom = (tasks, id) => tasks.filter((t) => t.id !== id);
      const addTo = (tasks, task) => [...tasks, task];

      switch (newStatus) {
        case "en proceso":
          setBeginTask((prevTodoTasks) => removeFrom(prevTodoTasks, task.id));
          setInProgressTasks((prevInProgressTasks) =>
            addTo(prevInProgressTasks, task)
          );
          break;
        case "terminado":
          await setDoc(doc(db, "historialMantencion", task.patente), {
            ...task,
            estado: newStatus,
          });

          if (!inProgressTasks.some((t) => t.id === task.id)) {
            setInProgressTasks((prevInProgressTasks) =>
              addTo(prevInProgressTasks, task)
            );
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskExpand = (taskId) => {
    setExpandedTask((prevExpandedTask) =>
      prevExpandedTask === taskId ? null : taskId
    );
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const translateEstado = (estado) => {
    switch (estado) {
      case "atencion_especial":
        return "Atención Especial";
      case "pendiente":
        return "Pendiente";
      case "prioridad":
        return "Prioridad";
      case "en proceso":
        return "En Proceso";
      case "terminado":
        return "Terminado";
      default:
        return estado;
    }
  };

  const getUserName = (userId) => {
    return users[userId]?.nombreCompleto || "Desconocido";
  };

  const formatoKilometraje = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  return (
    <div className={`grid ${isDarkMode ? "dark-mode" : ""}`}>
      <header>
        <Mecanico />
      </header>
      <aside className={`sidebar_left ${isDarkMode ? "dark-mode" : ""}`}>
        <div
          className={`contenedor_mantencion ${isDarkMode ? "dark-mode" : ""}`}
        >
          <div className={`titulo_mantencion ${isDarkMode ? "dark-mode" : ""}`}>
            Pendientes
          </div>
          <div className={`mantencion ${isDarkMode ? "dark-mode" : ""}`}>
            <ul className="lista_mantencion">
              {beginTask.map((task) => (
                <div
                  key={task.id}
                  className={`task-container ${isDarkMode ? "dark-mode" : ""}
                    ${expandedTask === task.id ? "expanded" : ""}`}
                  onClick={() => handleTaskExpand(task.id)}
                >
                  <ul
                    className={`lista_titular ${isDarkMode ? "dark-mode" : ""}`}
                  >
                    <li
                      className={`contenido_lista ${
                        isDarkMode ? "dark-mode" : ""
                      }`}
                    >
                      Patente: {task.id}
                    </li>
                    <li
                      className={`contenido_lista ${
                        isDarkMode ? "dark-mode" : ""
                      }`}
                    >
                      Estado: {translateEstado(task.estado)}
                    </li>
                  </ul>

                  {expandedTask === task.id && (
                    <>
                      <ul
                        className={`descripcion_lista ${
                          isDarkMode ? "dark-mode" : ""
                        }`}
                      >
                        <li>Descripción: {task.descripcion}</li>
                        <li>
                          Kilometro de Mantención:{" "}
                          {formatoKilometraje(task.kilometrajeMantencion)}
                        </li>
                        <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                        <li>
                          Producto:{" "}
                          {task.productos.map((producto, index) => (
                            <p key={index}> - {producto.nombreProducto}</p>
                          ))}
                        </li>
                        {expandedTask === task.id && (
                          <button
                            style={{ backgroundColor: "red" }}
                            onClick={() => updateTaskStatus(task, "en proceso")}
                          >
                            Tomar Tarea
                          </button>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <aside className={`sidebar_centro ${isDarkMode ? "dark-mode" : ""}`}>
        <div
          className={`contenedor_mantencion ${isDarkMode ? "dark-mode" : ""}`}
        >
          <div className={`titulo_mantencion ${isDarkMode ? "dark-mode" : ""}`}>
            En Proceso
          </div>
          <div className="mantencion">
            <ul className="lista_mantencion">
              {inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-container ${isDarkMode ? "dark-mode" : ""}
                    ${expandedTask === task.id ? "expanded" : ""}`}
                  onClick={() => handleTaskExpand(task.id)}
                >
                  <ul
                    className={`lista_titular ${isDarkMode ? "dark-mode" : ""}`}
                  >
                    <li
                      className={`contenido_lista ${
                        isDarkMode ? "dark-mode" : ""
                      }`}
                    >
                      Patente: {task.id}
                    </li>
                    <li
                      className={`contenido_lista ${
                        isDarkMode ? "dark-mode" : ""
                      }`}
                    >
                      Persona a Cargo: {getUserName(task.personaTomadora)}
                    </li>
                  </ul>

                  {expandedTask === task.id && (
                    <>
                      <ul
                        className={`descripcion_lista ${
                          isDarkMode ? "dark-mode" : ""
                        }`}
                      >
                        <li>Descripción: {task.descripcion}</li>
                        <li>
                          Kilometro de Mantención:{" "}
                          {formatoKilometraje(task.kilometrajeMantencion)}
                        </li>
                        <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                        <li>
                          Producto:{" "}
                          {task.productos.map((producto, index) => (
                            <p key={index}> - {producto.nombreProducto}</p>
                          ))}
                        </li>
                        {expandedTask === task.id && (
                          <button
                            style={{ backgroundColor: "red" }}
                            onClick={() => updateTaskStatus(task, "terminado")}
                          >
                            Finalizar Tarea
                          </button>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </aside>
      <aside className={`sidebar_rigth ${isDarkMode ? "dark-mode" : ""}`}>
        <div
          className={`contenedor_mantencion ${isDarkMode ? "dark-mode" : ""}`}
        >
          <div className={`titulo_mantencion ${isDarkMode ? "dark-mode" : ""}`}>
            Terminadas
          </div>
          <div className="mantencion">
            <ul className="lista_mantencion">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-container ${isDarkMode ? "dark-mode" : ""}
                    ${expandedTask === task.id ? "expanded" : ""}`}
                  onClick={() => handleTaskExpand(task.id)}
                >
                  <ul
                    className={`lista_titular ${isDarkMode ? "dark-mode" : ""}`}
                  >
                    <li
                      className={`contenido_lista ${
                        isDarkMode ? "dark-mode" : ""
                      }`}
                    >
                      Patente: {task.id}
                    </li>
                  </ul>

                  {expandedTask === task.id && (
                    <>
                      <ul
                        className={`descripcion_lista ${
                          isDarkMode ? "dark-mode" : ""
                        }`}
                      >
                        <li>Descripción: {task.descripcion}</li>
                        <li>
                          Kilometro de Mantención:{" "}
                          {formatoKilometraje(task.kilometrajeMantencion)}
                        </li>
                        <li>Fecha: {formatDate(new Date(task.fecha))}</li>
                        <li>
                          Producto:{" "}
                          {task.productos.map((producto, index) => (
                            <p key={index}> - {producto.nombreProducto}</p>
                          ))}
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default GestionMantenciones;
