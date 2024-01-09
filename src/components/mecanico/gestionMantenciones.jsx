// Componente GestionMantenciones:  
// Este componente React proporciona una interfaz para la gestión dinámica de tareas de mantenciones, 
// dividiéndolas en tres secciones: "Tareas por hacer", "Tareas en proceso" y "Terminado". 
// Funciones y Características Principales:  
// Recupera datos de mantenciones desde Firestore al cargar el componente. 
// Muestra las tareas organizadas por estado ('pendiente', 'en proceso', 'Terminado'). 
// Permite la expansión de cada tarea para mostrar opciones adicionales. 
// Permite la actualización del estado de una tarea al ser tomada o finalizada. 
// Ofrece una interfaz clara y eficiente para la gestión de las mantenciones. 

import '../styles/gestionMantenciones.css'
import React, { useState, useEffect } from 'react';
import Mecanico from './mecanico';
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
} from 'firebase/firestore';

const GestionMantenciones = () => {
  const [beginTask, setBeginTask] = useState([]);
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [specialAttentionTasks, setSpecialAttentionTasks] = useState([]);
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

        // Sort tasks based on estado ('pendiente', 'en proceso', 'terminado')
        const sortedTasks = {
          'pendiente': [],
          'prioridad': [],
          'atencion especial': [],
          'en proceso': [],
          'terminado': [],
        };

        allTasksData.forEach((task) => {
          sortedTasks[task.estado].push(task);
        });

        // Update state with tasks data
        setBeginTask(sortedTasks['pendiente']);
          setPriorityTasks(sortedTasks['prioridad']);
          setSpecialAttentionTasks(sortedTasks['atencion especial']);
          setInProgressTasks(sortedTasks['en proceso']);
          setCompletedTasks(sortedTasks['terminado']);
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
        case 'terminado':
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
      <Mecanico />
      <div>
        <div>
          <div className="container_mantencion_titulo">
            <h1>Gestión de Mantenciones</h1>
          </div>

          <div className="container_mantencion">
            <div className="container_mantencion_tareas">
              <div className="container_mantencion_tareas_titulos">
                <h2>Tareas por Hacer</h2>
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
                    {expandedTask === task.id && (
                      <button onClick={() => updateTaskStatus(task, 'en proceso')}>
                        Tomar Tarea
                      </button>
                    )}
                  </div>
                ))}
              </ul>
            </div>

            <div className="container_mantencion_tareas">
              <div className="container_mantencion_tareas_titulos">
                <h2>Tareas en Proceso</h2>
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
                    {expandedTask === task.id && (
                      <button onClick={() => updateTaskStatus(task, 'terminado')}>
                        Finalizar Tarea
                      </button>
                    )}
                  </div>
                ))}
              </ul>
            </div>

            <div className="container_mantencion_tareas">
              <div className="container_mantencion_tareas_titulos">
                <h2>Terminado</h2>
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

export default GestionMantenciones;