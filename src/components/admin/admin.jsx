import { SimpleTreeView } from '@mui/x-tree-view';
import { TreeItem } from '@mui/x-tree-view';
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import Logo from "../../images/LogoSinFondo.png";
import { DarkModeContext } from "../../context/darkMode";
import Logout from "@mui/icons-material/Logout";
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import TaskIcon from '@mui/icons-material/Task';
import QRCodeIcon from '@mui/icons-material/QRCode';
import ViewListIcon from '@mui/icons-material/ViewList';
import "../styles/admin.css";
import "../styles/darkMode.css";
import Notificacion from "./notificaciones";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from '@mui/material/Box';

const Admin = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [showNotification, setShowNotification] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      alert("Se ha cerrado la sesión");
    } catch (error) {
      console.log(error);
      alert("Error al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleSubMenu = (menu) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
    setIsSettingsMenuOpen(false);
  };

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
    setOpenSubMenu(null);
  };

  const handleShowNotification = () => setShowNotification(!showNotification);

  return (
    <>
      <header className={`encabezado ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="logo">
          <Link to="/indexAdmin">
            <img src={Logo} alt="logo" />
          </Link>
        </div>

        <div className="menu_lateral">
          <Box sx={{ minWidth: 250 }}>
            <SimpleTreeView>
              
              <TreeItem 
                itemId="grid2" 
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <QRCodeIcon className='iconos-navb'/>
                    <p className='tree-p'>Ventas</p>
                  </div>
                }
              >
                <div className='menuArbol'>
                  <Link to="/generarFactura" className="tree-link">
                    <TaskIcon className='iconos-navb' />
                    Realizar Factura
                  </Link>
                  <Link to="/historialBoleta&Factura" className="tree-link">Historial de Ventas</Link>
                  <Link to="/listadoMisFacturas" className="tree-link">Mis Facturas</Link>
                </div>
              </TreeItem>

              <TreeItem 
                itemId="grid" 
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DeleteIcon className='iconos-navb'/>
                    <p className='tree-p'>Usuarios</p>
                  </div>
                }
              >
                <div className='menuArbol'>
                  <Link to="/agregarUsuario" className="tree-link">Crear Usuario</Link>
                  <Link to="/listarUsuario" className="tree-link">Listar Usuarios</Link>
                </div>
              </TreeItem>

              <div className='menuArbol'>
                <Link to="/gestionMantencionesAdmin" className="tree-link">Tareas</Link>
                <Link to="/generarqrAdmin" className="tree-link">
                  <QRCodeIcon className='iconos-navb'/>
                  Generar QR
                </Link>
                <Link to="/historialmantencion" className="tree-link">Historial</Link>
              </div>

              <TreeItem 
                itemId="grid1" 
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TaskIcon className='iconos-navb' />
                    <p className='tree-p'>Proveedor</p>
                  </div>
                }
              >
                <div className='menuArbol'>
                  <Link to="/listadoFacturas" className="tree-link">Historial facturas de proveedor</Link>
                  <Link to="/agregarFactura" className="tree-link">Agregar Factura Proveedor</Link>
                </div>
              </TreeItem>

              <TreeItem 
                itemId="grid3" 
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ViewListIcon className='iconos-navb'/>
                    <p className='tree-p'>Inventario</p>
                  </div>
                }
              >
                <div className='menuArbol'>
                  <Link to="/listarInventario" className="tree-link">Listar Inventario</Link>
                  <Link to="/agregarInventario" className="tree-link">Agregar Producto</Link>
                </div>
              </TreeItem>

              <TreeItem 
                itemId="grid4" 
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <DeleteIcon className='iconos-navb' />
                    <p className='tree-p'>Cliente</p>
                  </div>
                }
              >
                <div className='menuArbol'>
                  <Link to="/ListarCliente" className="tree-link">Listar Clientes</Link>
                  <Link to="/agregarCliente" className="tree-link">Crear Clientes</Link>
                </div>
              </TreeItem>

            </SimpleTreeView>
          </Box>
        </div>

        <div>
          <button
            onClick={toggleSettingsMenu}
            className={`boton_config ${isDarkMode ? "dark-mode" : ""}`}
          >
            <SettingsIcon fontSize="large" />
          </button>
          {isSettingsMenuOpen && (
            <div className={`settings-menu ${isDarkMode ? "dark-mode" : ""}`}>
              <ul>
                <li>
                  <button
                    className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
                    onClick={handleShowNotification}
                  >
                    <NotificationsIcon />
                  </button>
                  {showNotification && <Notificacion />}
                  <span>Notificaciones</span>
                </li>

                <li>
                  <button
                    onClick={toggleDarkMode}
                    className={`boton_darkMode ${isDarkMode ? "dark-mode" : ""}`}
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
                  <span>Cerrar sesión</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="overlay">
          <label className="burger" htmlFor="burger">
            <input
              type="checkbox"
              id="burger"
              checked={isMenuOpen}
              onChange={toggleMenu}
            />
            <span className={`span ${isDarkMode ? "dark-mode" : ""}`}></span>
            <span className={`span ${isDarkMode ? "dark-mode" : ""}`}></span>
            <span className={`span ${isDarkMode ? "dark-mode" : ""}`}></span>
          </label>

          <div className={`arbol ${isMenuOpen ? "open" : ""}`}>
            {/* <Link
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
            <hr /> */}
          </div>

        </div>
      </header>
    </>
  );
};

export default Admin;
