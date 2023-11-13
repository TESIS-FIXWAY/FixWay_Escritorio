import '../styles/gestionMantenciones.css';
import React, { useState, useEffect } from 'react';
import Mecanico from './mecanico';
import { db } from '../../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

const GestionMantenciones = () => {
  // Estado para las tareas en cada estado
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

  const handleTakeTaskClick = (task) => {
    console.log('Botón Tomar tarea clicado', task);
  
    if (expandedTask === task.id) {
      return;
    }
  
    // Agrega la tarea a Tareas en proceso y elimínala de Tareas por hacer
    setInProgressTasks((prevInProgressTasks) => [...prevInProgressTasks, task]);
    setTodoTasks((prevTodoTasks) => prevTodoTasks.filter((t) => t.id !== task.id));
    // Cierra la tarea expandida
    setExpandedTask(null);
  
    // Imprime el estado actualizado utilizando el segundo argumento de setInProgressTasks
    setInProgressTasks((updatedInProgressTasks) => {
      console.log('Tareas en proceso después de tomar la tarea:', updatedInProgressTasks);
    });
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
                <h2>Tareas por hacer</h2>
              </div>
              <ul>
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
                      <button onClick={(e) => handleTakeTaskClick(task)}>
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
