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
  const [todoTasks, setTodoTasks] = useState([]);
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
          const task = { id: doc.id, ...doc.data(), estado: 'pendiente' };
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
        setTodoTasks(sortedTasks['pendiente']);
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

  const updateTaskStatus = async (task, newStatus) => {
    const taskRef = doc(db, 'mantenciones', task.id);

    try {
      await updateDoc(taskRef, { estado: newStatus });

      // Update state with the changed tasks
      switch (newStatus) {
        case 'en proceso':
          setTodoTasks((prevTodoTasks) => prevTodoTasks.filter((t) => t.id !== task.id));
          setInProgressTasks((prevInProgressTasks) => [...prevInProgressTasks, task]);




          break;
        case 'entregados':
          setInProgressTasks((prevInProgressTasks) =>
            prevInProgressTasks.filter((t) => t.id !== task.id)
          );
          setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);

          // Collapse the expanded task if it is the one that was just completed
          if (expandedTask === task.id) {
            setExpandedTask(null);
          }

          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Function to handle expanding/collapsing tasks
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
                <h2>Tareas por hacer</h2>
              </div>
              <ul style={{ height: calculateContainerHeight(todoTasks) }}>
                {todoTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-container ${expandedTask === task.id ? 'expanded' : ''}`}
                    onClick={() => handleTaskExpand(task.id)}
                  >
                    <li>
                      {task.id} <br />
                      {task.descripcion}
                    </li>
                    {expandedTask === task.id && (
                      <button onClick={() => updateTaskStatus(task, 'en proceso')}>
                        Tomar tarea
                      </button>
                    )}
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
                    key={task.id}
                    className={`task-container ${expandedTask === task.id ? 'expanded' : ''}`}
                    onClick={() => handleTaskExpand(task.id)}
                  >
                    <li>
                      {task.id} <br />
                      {task.descripcion}
                    </li>
                    {expandedTask === task.id && (
                      <button onClick={() => updateTaskStatus(task, 'entregados')}>
                        Finalizar Tarea
                      </button>
                    )}
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
                    key={task.id}
                    className={`task-container ${expandedTask === task.id ? 'expanded' : ''}`}
                    // onClick={() => handleTaskExpand(task.id)}
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