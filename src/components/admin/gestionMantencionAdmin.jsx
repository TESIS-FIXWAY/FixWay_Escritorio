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

  const calculateContainerHeight = (tasks) => {
    return tasks.length === 0 ? '200px' : `${tasks.length * 40}px`;
  };

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

        const sortedTasks = {
          'pendiente': [],
          'en proceso': [],
          'terminado': [],
        };

        allTasksData.forEach((task) => {
          sortedTasks[task.estado].push(task);
        });

        setBeginTask(sortedTasks['pendiente']);
        setInProgressTasks(sortedTasks['en proceso']);
        setCompletedTasks(sortedTasks['terminado']);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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