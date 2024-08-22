import "../styles/admin.css";
import "../styles/darkMode.css";
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import Logo from "../../images/LogoSinFondo.png";
import { DarkModeContext } from "../../context/darkMode";
import Logout from "@mui/icons-material/Logout";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import RestoreIcon from "@mui/icons-material/Restore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import StoreIcon from "@mui/icons-material/Store";
import QRCodeIcon from "@mui/icons-material/QRCode";
import ViewListIcon from "@mui/icons-material/ViewList";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import Groups2Icon from "@mui/icons-material/Groups2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InventoryIcon from "@mui/icons-material/Inventory";
import PostAddIcon from "@mui/icons-material/PostAdd";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import NoCrashIcon from "@mui/icons-material/NoCrash";
import GarageIcon from "@mui/icons-material/Garage";
import Notificacion from "./notificaciones";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";

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
            <img src={Logo} alt="Logo de la aplicación" />
          </Link>
        </div>
        <div className="menu_lateral">
          <Box sx={{ minWidth: 250 }}>
            <SimpleTreeView>
              <TreeItem
                itemId="ventas"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <StoreIcon className="iconos-navb" />
                    <p className="tree-p">Ventas</p>
                  </div>
                }
              >
                <div className="menuArbol">
                  <Link to="/generarFactura" className="tree-link">
                    <ShoppingBagIcon className="iconos-navb" />
                    Realizar Venta
                  </Link>
                  <Link to="/historialBoleta&Factura" className="tree-link">
                    <RestoreIcon className="iconos-navb" />
                    Historial de Ventas
                  </Link>
                  <Link to="/listadoMisFacturas" className="tree-link">
                    <DescriptionIcon className="iconos-navb" />
                    Mis Ventas
                  </Link>
                </div>
              </TreeItem>
              <TreeItem
                itemId="usuarios"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <GroupIcon className="iconos-navb" />
                    <p className="tree-p">Usuarios</p>
                  </div>
                }
              >
                <div className="menuArbol">
                  <Link to="/agregarUsuario" className="tree-link">
                    <PersonAddIcon className="iconos-navb" />
                    Crear Usuario
                  </Link>
                  <Link to="/listarUsuario" className="tree-link">
                    <GroupsIcon className="iconos-navb" />
                    Listar Usuarios
                  </Link>
                </div>
              </TreeItem>
              <TreeItem
                itemId="proveedor"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TaskIcon className="iconos-navb" />
                    <p className="tree-p">Proveedor</p>
                  </div>
                }
              >
                <div className="menuArbol">
                  <Link to="/agregarFactura" className="tree-link">
                    <AttachFileIcon className="iconos-navb" />
                    Agregar Factura
                  </Link>
                  <Link to="/listadoFacturas" className="tree-link">
                    <RestoreIcon className="iconos-navb" />
                    Historial facturas
                  </Link>
                </div>
              </TreeItem>
              <TreeItem
                itemId="inventario"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <InventoryIcon className="iconos-navb" />
                    <p className="tree-p">Inventario</p>
                  </div>
                }
              >
                <div className="menuArbol">
                  <Link to="/agregarInventario" className="tree-link">
                    <PostAddIcon className="iconos-navb" />
                    Agregar Producto
                  </Link>
                  <Link to="/listarInventario" className="tree-link">
                    <ViewListIcon className="iconos-navb" />
                    Listar Inventario
                  </Link>
                </div>
              </TreeItem>
              <TreeItem
                itemId="cliente"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <EmojiPeopleIcon className="iconos-navb" />
                    <p className="tree-p">Cliente</p>
                  </div>
                }
              >
                <div className="menuArbol">
                  <Link to="/agregarCliente" className="tree-link">
                    <PersonAddIcon className="iconos-navb" />
                    Crear Clientes
                  </Link>
                  <Link to="/ListarCliente" className="tree-link">
                    <Groups2Icon className="iconos-navb" />
                    Listar Clientes
                  </Link>
                </div>
              </TreeItem>
              <TreeItem
                itemId="automovil"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TimeToLeaveIcon className="iconos-navb" />
                    <p className="tree-p">Automóvil</p>
                  </div>
                }
              >
                <div className="menuArbol">
                  <Link to="/agregarAutomovilAdmin" className="tree-link">
                    <NoCrashIcon className="iconos-navb" />
                    Agregar Automóvil
                  </Link>
                  <Link to="/listadoAutomovil" className="tree-link">
                    <GarageIcon className="iconos-navb" />
                    Listar Automóvil
                  </Link>
                </div>
              </TreeItem>

              <div className="menuArbol">
                <Link to="/tensorflow" className="tree-link">
                  <AssignmentIcon className="iconos-navb" />
                  Tensor IA
                </Link>
                <Link to="/gestionMantencionesAdmin" className="tree-link">
                  <AssignmentIcon className="iconos-navb" />
                  Tareas
                </Link>
                <Link to="/generarqrAdmin" className="tree-link">
                  <QRCodeIcon className="iconos-navb" />
                  Generar QR
                </Link>
                <Link to="/historialmantencion" className="tree-link">
                  <WorkHistoryIcon className="iconos-navb" />
                  Historial
                </Link>
              </div>
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
      </header>
    </>
  );
};

export default Admin;
