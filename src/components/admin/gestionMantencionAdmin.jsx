// Este componente GestionMantencionesAdmin se encarga de la gestión de tareas de mantenciones. 
// Permite visualizar, expandir y actualizar el estado de las tareas, clasificándolas en "por hacer", "en proceso" y "entregadas".  
// Utiliza Firebase Firestore para obtener y actualizar datos de tareas y se integra con el componente Admin para la navegación.  
// Las tareas se organizan en tres listas según su estado, y se pueden expandir para mostrar detalles adicionales. 
// Funciones y características principales: 
// Visualización y clasificación de tareas por estado. 
// Expansión de tareas para ver detalles adicionales. 
// Actualización del estado de las tareas (de "por hacer" a "en proceso" y de "en proceso" a "entregadas"). 
// Cálculo dinámico de la altura del contenedor basado en el número de tareas. 
// Obtención y actualización de datos desde Firebase Firestore. 
// Integración con el componente Admin para la navegación en la aplicación. 

import '../styles/gestionMantenciones.css'
import React, { useState, useEffect } from 'react';
import Admin from "./admin";
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
} from 'firebase/firestore';

const GestionMantencionesAdmin = () => {
  const [beginTask, setBeginTask] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);

  // Function to calculate container height based on the number of tasks
  const calculateContainerHeight = (tasks) => {
    return tasks.length === 0 ? '200px' : `${tasks.length * 40}px`;
  };

  // Function to fetch initial data from Firestore
  const fetchData = async () => {
    try {
      const mantencionesCollection = collection(db, 'mantenciones');
      const q = query(mantencionesCollection);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allTasksData = [];

        querySnapshot.forEach((doc) => {
          const task = { id: doc.id, ...doc.data(), estado: doc.data().estado };
          allTasksData.push(task);
        });

        // Sort tasks based on estado ('pendiente', 'en proceso', 'entregados')
        const sortedTasks = {
          'pendiente': [],
          'en proceso': [],
          'entregados': [],
        };

        allTasksData.forEach((task) => {
          sortedTasks[task.estado].push(task);
        });

        // Update state with tasks data
        setBeginTask(sortedTasks['pendiente']);
        setInProgressTasks(sortedTasks['en proceso']);
        setCompletedTasks(sortedTasks['entregados']);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect to fetch initial data from Firestore
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [beginTask, inProgressTasks, completedTasks]);

  const updateTaskStatus = async (task, newStatus) => {
    const taskRef = doc(db, 'mantenciones', task.id);
  
    try {
      await updateDoc(taskRef, { estado: newStatus });
  
      // Update state with the changed tasks
      switch (newStatus) {
        case 'en proceso':
          setBeginTask((prevTodoTasks) => prevTodoTasks.filter((t) => t.id !== task.id));
          if (!inProgressTasks.some((t) => t.id === task.id)) {
            setInProgressTasks((prevInProgressTasks) => [...prevInProgressTasks, task]);
          }
          break;
        case 'entregados':
          setInProgressTasks((prevInProgressTasks) =>
            prevInProgressTasks.filter((t) => t.id !== task.id)
          );
          if (!completedTasks.some((t) => t.id === task.id)) {
            setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleTaskExpand = (taskId) => {
    setExpandedTask((prevExpandedTask) =>
      prevExpandedTask === taskId ? null : taskId
    );
  };

  return (
    <>
      <Admin />
      <div>
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
                    key={`${task.id}-${task.estado}`}
                    className={`task-container ${expandedTask === task.id ? 'expanded' : ''}`}
                    onClick={() => handleTaskExpand(task.id)}
                  >
                    <li>
                      {task.id} <br />
                      {task.descripcion}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
            <div className="container_mantencion_tareas">
              <div className="container_mantencion_tareas_titulos">
                <h2>Tareas en proceso</h2>
              </div>
              <ul>
                {inProgressTasks.map((task) => (
                  <div
                    key={`${task.id}-${task.estado}`}
                    className={`task-container ${expandedTask === task.id ? 'expanded' : ''}`}
                    onClick={() => handleTaskExpand(task.id)}
                  >
                    <li>
                      {task.id} <br />
                      {task.descripcion}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
            <div className="container_mantencion_tareas">
              <div className="container_mantencion_tareas_titulos">
                <h2>Entregados</h2>
              </div>
              <ul>
                {completedTasks.map((task) => (
                  <div
                    key={`${task.id}-${task.estado}`}
                    className={`task-container ${expandedTask === task.id ? 'expanded' : ''}`}
                  >
                    <li>
                      {task.id} <br />
                      {task.descripcion}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GestionMantencionesAdmin;