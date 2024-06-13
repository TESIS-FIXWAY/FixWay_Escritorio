import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import Logo from "../../images/LogoSinFondo.png";
import "../styles/admin.css";
import "../styles/darkMode.css";
import { DarkModeContext } from "../../context/darkMode";
import NotificacionMecanico from "./notificacionesMecanico";

import { Logout } from "@mui/icons-material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Mecanico = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "America/Santiago",
    };
    return time.toLocaleTimeString("en-US", options);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log(user);
      alert("Se ha cerrado la sesión");
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <>
      <header className={`encabezado ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="logo">
          <Link to="/indexMecanico">
            <img src={Logo} alt="logo" />
          </Link>
        </div>
        <nav className={`arbol ${isDarkMode ? "dark-mode" : ""}`}>
          <ul className={`arbolitos ${isDarkMode ? "dark-mode" : ""}`}>
            <li>
              <Link
                to="/agregarAutomovil"
                className={`links ${isDarkMode ? "dark-mode" : ""} ${
                  window.location.pathname === "" ? "active" : ""
                }`}
              >
                <span className="link_name">Agregar Automóvil</span>
              </Link>
            </li>
            <li>
              <Link
                to="/agregarMantencion"
                className={`links ${isDarkMode ? "dark-mode" : ""} ${
                  window.location.pathname === "" ? "active" : ""
                }`}
              >
                <span className="link_name">Agregar Mantención</span>
              </Link>
            </li>
            <li>
              <Link
                to="/gestionMantenciones"
                className={`links ${isDarkMode ? "dark-mode" : ""} ${
                  window.location.pathname === "" ? "active" : ""
                }`}
              >
                <span className="link_name">Tablero de Tareas</span>
              </Link>
            </li>
            <li>
              <Link
                to="/listarInventarioMecanico"
                className={`links ${isDarkMode ? "dark-mode" : ""} ${
                  window.location.pathname === "" ? "active" : ""
                }`}
              >
                <span className="link_name">Listar Inventario</span>
              </Link>
            </li>
            <li>
              <Link
                to="/GenerarQR"
                className={`links ${isDarkMode ? "dark-mode" : ""} ${
                  window.location.pathname === "" ? "active" : ""
                }`}
              >
                <span className="link_name">Generar QR</span>
              </Link>
            </li>
            <li>
              <Link
                to="/GenerarListadoMantencion"
                className={`links ${isDarkMode ? "dark-mode" : ""} ${
                  window.location.pathname === "" ? "active" : ""
                }`}
              >
                <span className="link_name">
                  Descarga Historial de Mantención
                </span>
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <button
            className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
            onClick={handleShowNotification}
          >
            <NotificationsIcon />
          </button>
          {showNotification && <NotificacionMecanico />}
          <button
            onClick={toggleDarkMode}
            className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
          >
            {isDarkMode ? (
              <WbSunnyIcon color="#B4B4B4" />
            ) : (
              <NightlightIcon color="secondary" />
            )}
          </button>
          <button
            type="submit"
            onClick={handleLogout}
            className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
          >
            <Logout />
          </button>
        </div>
      </header>
    </>
  );
};

export default Mecanico;
