// Componente LoadingScreen:

// Este componente React representa una pantalla de carga con una animación y un indicador de progreso.

// Funciones y Características Principales:

// - Utiliza los hooks `useEffect` y `useState` para controlar la visibilidad de los elementos en diferentes momentos.
// - Muestra una imagen de un auto y el nombre "Hans Motors" de manera animada.
// - Utiliza estilos CSS para dar formato y animar los elementos de la pantalla de carga.
// - Muestra un indicador de progreso en forma de barra.



import React, { useEffect, useState } from 'react';
import './styles/loadingScreen.css';
import Car from '../images/AutoSinFondo2.png'; 

const LoadingScreen = () => {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTextVisible(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const imgTimeout = setTimeout(() => {
      document.querySelector('.text-background img').classList.add('visible');
    }, 1000); // Ajusta el tiempo según tus necesidades

    return () => clearTimeout(imgTimeout);
  }, []);


  return (
    <div className="loading-screen">
      {textVisible && (
        <div className="text-background">
          <img src={Car} alt="logo" />
          <p className="animated-text">
          </p>
        </div>
      )}

      {textVisible && (
        <div className="text-background">
          <p className="animated-text">
            <span>H</span>
            <span>a</span>
            <span>n</span>
            <span>s</span>
            <span> </span>
            <span>M</span>
            <span>o</span>
            <span>t</span>
            <span>o</span>
            <span>r</span>
            <span>s</span>
          </p>
        </div>
      )}

      <div className="progress-bar">
        <div className="progress-indicator"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
