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
import SettingsIcon from "@mui/icons-material/Settings";

const Mecanico = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [showNotification, setShowNotification] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

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

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
    setIsSubMenuOpen1(false);
    setIsSubMenuOpen2(false);
    setIsSubMenuOpen3(false);
  };

  const handleRotate = () => {
    const botonConfig = document.querySelector(".boton_config");
    botonConfig.classList.add("rotate");
    setTimeout(() => {
      botonConfig.classList.remove("rotate");
    }, 300);
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
            onClick={() => {
              toggleSettingsMenu();
              handleRotate();
            }}
            className={`boton_config ${isDarkMode ? "dark-mode" : ""}`}
          >
            <SettingsIcon />
          </button>
          {isSettingsMenuOpen && (
            <div className={`settings-menu ${isDarkMode ? "dark-mode" : ""}`}>
              <ul className="">
                <li>
                  <button
                    className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
                    onClick={handleShowNotification}
                  >
                    <NotificationsIcon />
                  </button>
                  {showNotification && <NotificacionMecanico />}
                  <span>Notificaciones</span>
                </li>

                <li>
                  <button
                    onClick={toggleDarkMode}
                    className={`boton_darkMode ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                  >
                    {isDarkMode ? (
                      <WbSunnyIcon color="#B4B4B4" />
                    ) : (
                      <NightlightIcon color="#fff" />
                    )}
                  </button>
                  <span>Modo Oscuro</span>
                </li>

                <li>
                  <button
                    type="submit"
                    onClick={handleLogout}
                    className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
                  >
                    <Logout />
                  </button>
                  <span>cerrar sesion</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Mecanico;
