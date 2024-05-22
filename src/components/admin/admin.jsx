import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import Logo from "../../images/LogoSinFondo.png";
import {
  Home,
  Person,
  PersonAdd,
  People,
  Menu,
  Logout,
  ShoppingCart,
  ListAlt,
  Description,
  Receipt,
  ReceiptLong,
  PostAdd,
  Inventory,
} from "@mui/icons-material";
import "../styles/admin.css";

const Admin = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen1, setIsSubMenuOpen1] = useState(false);
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState(false);
  const [isSubMenuOpen3, setIsSubMenuOpen3] = useState(false);
  const [isSubMenuOpen4, setIsSubMenuOpen4] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubMenu1 = () => {
    setIsSubMenuOpen1(!isSubMenuOpen1);
    setIsSubMenuOpen2(false);
    setIsSubMenuOpen3(false);
    setIsSubMenuOpen4(false);
  };

  const toggleSubMenu2 = () => {
    setIsSubMenuOpen2(!isSubMenuOpen2);
    setIsSubMenuOpen1(false);
    setIsSubMenuOpen3(false);
    setIsSubMenuOpen4(false);
  };

  const toggleSubMenu3 = () => {
    setIsSubMenuOpen3(!isSubMenuOpen3);
    setIsSubMenuOpen1(false);
    setIsSubMenuOpen2(false);
    setIsSubMenuOpen4(false);
  };

  const toggleSubMenu4 = () => {
    setIsSubMenuOpen4(!isSubMenuOpen4);
    setIsSubMenuOpen1(false);
    setIsSubMenuOpen2(false);
    setIsSubMenuOpen3(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  return (
    <>
      <header className={`encabezado ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="logo">
          <Link to="/indexAdmin">
            <img src={Logo} alt="logo" />
          </Link>
        </div>

        <nav className="arbol">
          <ul className="arbolitos">
            <li onClick={toggleSubMenu1}>
              <Link
                className={`links ${
                  window.location.pathname === "/agregarUsuario" ||
                  window.location.pathname === "/listarUsuario"
                    ? "active"
                    : ""
                }`}
              >
                <span className="link_name">Usuarios</span>
              </Link>
              {isSubMenuOpen1 && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      itemId="pickers-community"
                      to="/agregarUsuario"
                      className={`link ${
                        window.location.pathname === "/agregarUsuario"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">Crear Usuarios</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/listarUsuario"
                      className={`link ${
                        window.location.pathname === "/listarUsuario"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">Listar Usuarios</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/gestionMantencionesAdmin"
                className={`links ${
                  window.location.pathname === "/gestionMantencionesAdmin"
                    ? "active"
                    : ""
                }`}
              >
                <span className="link_name">Mantenciones</span>
              </Link>
            </li>

            <li onClick={toggleSubMenu2}>
              <Link
                className={`links ${
                  window.location.pathname === "/generarFactura" ||
                  window.location.pathname === "/agregarFactura"
                    ? "active"
                    : ""
                }`}
              >
                <span className="link_name">Facturas</span>
              </Link>
              {isSubMenuOpen2 && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/generarFactura"
                      className={`link ${
                        window.location.pathname === "/generarFactura"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">Generar Factura</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/agregarFactura"
                      className={`link ${
                        window.location.pathname === "/agregarFactura"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">
                        Agregar Factura de Proveedor
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li onClick={toggleSubMenu3}>
              <Link
                className={`links ${
                  window.location.pathname === "/listadoFacturas" ||
                  window.location.pathname === "/listadoMisFacturas"
                    ? "active"
                    : ""
                }`}
              >
                <span className="link_name">Mis Facturas</span>
              </Link>
              {isSubMenuOpen3 && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/listadoFacturas"
                      className={`link ${
                        window.location.pathname === "/listadoFacturas"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">
                        Listar Facturas de Proveedores
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/listadoMisFacturas"
                      className={`link ${
                        window.location.pathname === "/listadoMisFacturas"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">
                        Listar Mis Facturas/Boletas
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li onClick={toggleSubMenu4}>
              <Link
                className={`links ${
                  window.location.pathname === "/agregarInventario" ||
                  window.location.pathname === "/listadoMisFacturas"
                    ? "active"
                    : ""
                }`}
              >
                <span className="link_name">Inventario</span>
              </Link>
              {isSubMenuOpen4 && (
                <ul className="sub-menu">
                  <li>
                    <Link
                      to="/agregarInventario"
                      className={`link ${
                        window.location.pathname === "/agregarInventario"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">Agregar Inventario</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/listarInventario"
                      className={`link ${
                        window.location.pathname === "/listarInventario"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="link_name">Listar Inventario</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div>
          <button type="submit" onClick={handleLogout} className="boton_salir">
            <Logout />
          </button>
          <button onClick={toggleDarkMode} className="dark-mode-button">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="overlay">
          <label className="burger" htmlFor="burger">
            <input
              type="checkbox"
              id="burger"
              checked={isMenuOpen}
              onChange={toggleMenu}
            />
            <span></span>
            <span></span>
            <span></span>
          </label>

          <div className={`arbol ${isMenuOpen ? "open" : ""}`}>
            <Link
              itemId="pickers-community"
              to="/agregarUsuario"
              className={`link ${
                window.location.pathname === "/agregarUsuario" ? "active" : ""
              }`}
            >
              <span className="link_name">Crear Usuarios</span>
            </Link>
            <Link
              to="/listarUsuario"
              className={`link ${
                window.location.pathname === "/listarUsuario" ? "active" : ""
              }`}
            >
              <span className="link_name">Listar Usuarios</span>
            </Link>
            <hr />
            <Link
              to="/generarFactura"
              className={`link ${
                window.location.pathname === "/generarFactura" ? "active" : ""
              }`}
            >
              <span className="link_name">Generar Factura</span>
            </Link>
            <Link
              to="/agregarFactura"
              className={`link ${
                window.location.pathname === "/agregarFactura" ? "active" : ""
              }`}
            >
              <span className="link_name">Agregar Factura de Proveedor</span>
            </Link>
            <hr />
            <Link
              to="/listadoFacturas"
              className={`link ${
                window.location.pathname === "/listadoFacturas" ? "active" : ""
              }`}
            >
              <span className="link_name">Listar Facturas de Proveedores</span>
            </Link>
            <Link
              to="/listadoMisFacturas"
              className={`link ${
                window.location.pathname === "/listadoMisFacturas"
                  ? "active"
                  : ""
              }`}
            >
              <span className="link_name">Listar Mis Facturas/Boletas</span>
            </Link>
            <hr />
            <Link
              to="/agregarInventario"
              className={`link ${
                window.location.pathname === "/agregarInventario"
                  ? "active"
                  : ""
              }`}
            >
              <span className="link_name">Agregar Inventario</span>
            </Link>

            <Link
              to="/listarInventario"
              className={`link ${
                window.location.pathname === "/listarInventario" ? "active" : ""
              }`}
            >
              <span className="link_name">Listar Inventario</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Admin;
