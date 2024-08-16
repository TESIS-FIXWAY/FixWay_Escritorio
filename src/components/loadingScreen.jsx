import React, { useEffect, useState } from "react";
import "./styles/loadingScreen.css";
import Car from "../images/logoSinfondo2.png";

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
      document.querySelector(".text-background img").classList.add("visible");
    }, 1000);

    return () => clearTimeout(imgTimeout);
  }, []);

  return (
    <div className="loading-screen">
      {textVisible && (
        <div className="text-background">
          <img src={Car} alt="logo" />
          <p className="animated-text"></p>
        </div>
      )}

      {textVisible && (
        <div className="text-background">
          <p className="animated-text">
            <span>F</span>
            <span>i</span>
            <span>x</span>
            <span>W</span>
            <span>a</span>
            <span>y</span>
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
