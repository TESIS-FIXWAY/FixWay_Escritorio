import '../styles/gestionMantenciones.css';
import React, { useState, useEffect } from 'react';
import Mecanico from './mecanico';
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc
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

  // useEffect to fetch initial data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore query to get maintenance tasks
        const mantencionesCollection = collection(db, 'mantenciones');
        const q = query(mantencionesCollection);

        // Real-time updates with onSnapshot
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          try{
            const allTasksData = [];

            querySnapshot.forEach((doc) => {
              const task = { id: doc.id, ...doc.data(), estado: 'pendiente' };
              allTasksData.push(task);
            });

            // Update state with tasks data
            setTodoTasks(allTasksData);
            setInProgressTasks([]);
            setCompletedTasks([]);
          }catch(error) {
            console.error('Error getting documents', error);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle changes in task status (e.g., from "pending" to "in progress")
  const handleTaskStatusChange = async (task) => {
    const taskRef = doc(db, 'mantenciones', task.id);
    
    // Update task status based on current status
    if (task.estado === 'pendiente') {
      await updateDoc(taskRef, { estado: 'en proceso' });

      // Update state with the changed tasks
      setInProgressTasks((prevInProgressTasks) => [...prevInProgressTasks, task]);
      setTodoTasks((prevTodoTasks) => prevTodoTasks.filter((t) => t.id !== task.id));
    } if (task.estado === 'en proceso') {
      await updateDoc(taskRef, { estado: 'entregados' });

      // Update state with the changed tasks
      setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);
      setInProgressTasks((prevInProgressTasks) => prevInProgressTasks.filter((t) => t.id !== task.id));
    }

    // Collapse the expanded task
    setExpandedTask(null);
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
                      <button onClick={(e) => handleTaskStatusChange(task)}>
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
                      <button onClick={(e) => handleTaskStatusChange(task)}>
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
                  <div key={task.id} className="task-container">
                    <li>{task.descripcion}</li>
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
