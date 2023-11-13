import '../styles/gestionMantenciones.css';
import React, { useState, useEffect } from 'react';
import Mecanico from './mecanico';
import { db } from '../../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

const GestionMantenciones = () => {
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);


  const calculateContainerHeight = (tasks) => {
    if (tasks.length === 0) {
      return '200px'; // Establece una altura predeterminada si la lista está vacía
    } else {
      return `${tasks.length * 40}px`; // Ajusta el valor según tus necesidades
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const mantencionesCollection = collection(db, 'mantenciones');
      const q = query(mantencionesCollection);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const allTasksData = [];

        querySnapshot.forEach((doc) => {
          const task = { id: doc.id, ...doc.data(), estado: 'Por hacer' };
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


  const handleTaskClick = (taskId) => {
    setExpandedTask(taskId === expandedTask ? null : taskId);
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
              <ul>
                {todoTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-container ${expandedTask === task.id ? 'expanded' : ''}`}
                    onClick={() => handleTaskClick(task.id)}
                  >
                    <li>{task.descripcion}</li>
                    {expandedTask === task.id && (
                      <button onClick={(e) => e.stopPropagation()}>
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
                  <div key={task.id} className="task-container">
                    <li>{task.descripcion}</li>
                  </div>
                ))}
              </ul>
            </div>
  
            <div className="container_mantencion_tareas">
              <div className="container_mantencion_tareas_titulos">
                <h2>Finalizadas</h2>
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
