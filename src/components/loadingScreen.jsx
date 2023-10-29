import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';
import Car from '../images/car.png'; 


const LoadingScreen = () => {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTextVisible(true);
    }, 500); 

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="loading-screen">
      {textVisible && (
        <div className="text-background">
          <img src={Car} alt="logo" />
          <p className="animated-text">
            {/* Tu texto aquí */}
          </p>
        </div>
      )}

      {textVisible && (
        <div className="text-background">
          <p className="animated-text">
            <span>H</span>
            <span>a</span>
            <span>m</span>
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
