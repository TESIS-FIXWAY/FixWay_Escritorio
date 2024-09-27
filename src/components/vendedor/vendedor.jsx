import "../styles/admin.css";
import "../styles/darkMode.css";
import React, { useState, useContext, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../dataBase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import Logo from "../../images/LogoSinFondo.png";
import { DarkModeContext } from "../../context/darkMode";
import Logout from "@mui/icons-material/Logout";
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import DescriptionIcon from "@mui/icons-material/Description";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import RestoreIcon from "@mui/icons-material/Restore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TaskIcon from "@mui/icons-material/Task";
import StoreIcon from "@mui/icons-material/Store";
import ViewListIcon from "@mui/icons-material/ViewList";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import Groups2Icon from "@mui/icons-material/Groups2";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InventoryIcon from "@mui/icons-material/Inventory";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GarageIcon from "@mui/icons-material/Garage";
import NotificacionVendedor from "./notificacionesVendedor";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import Box from "@mui/material/Box";

const Vendedor = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [showNotification, setShowNotification] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userUID = currentUser.uid;

        const userDocRef = doc(db, "users", userUID);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No se encontró el documento del usuario.");
        }
      } else {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const translateRol = (rol) => {
    switch (rol) {
      case "administrador":
        return "Administrador";
      case "mecanico":
        return "Mecánico";
      case "vendedor":
        return "Vendedor";
      default:
        return rol;
    }
  };

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

  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
    setOpenSubMenu(null);
  };

  const handleShowNotification = () => setShowNotification(!showNotification);

  return (
    <>
      <header className={`encabezado ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="logo">
          <Link to="/indexVendedor">
            <img src={Logo} alt="Logo de la aplicación" />
          </Link>
        </div>

        <div className="horizontal-container">
          <p>
            <ContactEmergencyIcon className="iconos-navb" />
            {userData?.nombre} {userData?.apellido}
          </p>
          {/* <p>
            <ContactMailIcon className="iconos-navb" />
            {userData?.email}
          </p> */}
          <p>
            <SupervisedUserCircleIcon className="iconos-navb" />
            {translateRol(userData?.rol)}
          </p>
          <button
            onClick={toggleSettingsMenu}
            className={`boton_config ${isDarkMode ? "dark-mode" : ""}`}
          >
            <SettingsIcon fontSize="large" />
          </button>
          {isSettingsMenuOpen && (
            <div className={`settings-menu ${isDarkMode ? "dark-mode" : ""}`}>
              <ul>
                {/* <li>
                  <button
                    className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
                    onClick={handleShowNotification}
                  >
                    <NotificationsIcon />
                    <span style={{ marginLeft: "10px" }}>Notificaciones</span>
                  </button>
                  {showNotification && <NotificacionVendedor />}
                </li> */}
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
                    <span style={{ marginLeft: "10px" }}>Modo Oscuro</span>
                  </button>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className={`boton_salir ${isDarkMode ? "dark-mode" : ""}`}
                  >
                    <Logout />
                    <span style={{ marginLeft: "10px" }}>Cerrar sesión</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className={`menu_lateral ${isDarkMode ? "dark-mode" : ""}`} >
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
                  <Link to="/generarFacturaVendedor" className="tree-link">
                    <ShoppingBagIcon className="iconos-navb" />
                    Realizar Venta
                  </Link>
                  <Link
                    to="/historialBoleta&FacturaVendedor"
                    className="tree-link"
                  >
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

              <div className="menuArbol">
                <Link to="/listadoAutomovil" className="tree-link">
                  <GarageIcon className="iconos-navb" />
                  Listar Automóvil
                </Link>
                <Link to="/gestionMantencionesAdmin" className="tree-link">
                  <AssignmentIcon className="iconos-navb" />
                  Tareas
                </Link>
                <Link to="/historialmantencion" className="tree-link">
                  <WorkHistoryIcon className="iconos-navb" />
                  Historial
                </Link>
              </div>
              <div className="menuArbol">
              </div>
            </SimpleTreeView>
          </Box>
        </div>
      </header>
    </>
  );
};

export default Vendedor;
