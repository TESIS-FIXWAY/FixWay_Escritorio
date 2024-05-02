import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import "../styles/admin.css";

import { Home,
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
  Inventory } 
from '@mui/icons-material'; 



const Admin = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <>
      <div>

        <header className="header">
          <div className="contenedor-header">
            
            <div className="btn-menu">
              <label htmlFor="btn-menu">
                <Menu />
              </label>

              <Link to="/indexAdmin" >
                <label >
                  <Home className="menu_home"/>
                </label>
              </Link>

            </div>
            <div className="logo">
              <h1>Settore</h1>
            </div>
            <div className="reloj">
              <p>{formatTime(currentTime)}</p>
            </div>
            <nav className="menu">
              <a>Administrador</a>
            </nav>
          </div>

          <button type="submit" onClick={handleLogout} className="boton_salir">
            <Logout />
          </button>
          
        </header>

        <input type="checkbox" id="btn-menu" checked></input> {/* Modificado aquí */}

        <div className="contenedor-menu">
          <div className="cont_menu">
            <nav>

              <hr />
              
              <SimpleTreeView 
                className={`link ${
                  window.location.pathname === "/agregarUsuario" || window.location.pathname === "/listarUsuario" ? "active" : ""
                }`}
                id="arbol"
                icon={<Person />} 
              >

                <TreeItem itemId="pickers" label="Usuarios">
                  <Link itemId="pickers-community"
                      to="/agregarUsuario"
                      className={`link ${
                        window.location.pathname === "/agregarUsuario" ? "active" : ""
                      }`}>
                      <PersonAdd />
                      <span className="link_name">Crear Usuarios</span>
                    </Link>

                    <Link
                      to="/listarUsuario"
                      className={`link ${
                        window.location.pathname === "/listarUsuario" ? "active" : ""
                      }`}
                    >
                      <People />
                      <span className="link_name">Listar Usuarios</span>
                    </Link>
                </TreeItem>
              </SimpleTreeView>


              <hr />

              <Link
                to="/gestionMantencionesAdmin"
                className={`link ${
                  window.location.pathname === "/gestionMantencionesAdmin"
                    ? "active"
                    : ""
                }`}
              >
                <ListAlt />
                <span className="link_name">Mantenciones</span>
              </Link>

              <hr />

              <Link
                to="/generarFactura"
                className={`link ${
                  window.location.pathname === "/generarFactura" ? "active" : ""
                }`}
              >
                <ReceiptLong />
                <span className="link_name">Generar Factura</span>
              </Link>


              <Link
                to="/agregarFactura"
                className={`link ${
                  window.location.pathname === "/agregarFactura" ? "active" : ""
                }`}
              >
                <PostAdd />
                <span className="link_name">Factura de Proveedor</span>
              </Link>


              <Link
                to="/listadoFacturas"
                className={`link ${
                  window.location.pathname === "/listadoFacturas"
                    ? "active"
                    : ""
                }`}
              >
                <People />
                <span className="link_name">
                  Listar Facturas de Proveedores
                </span>
              </Link>

              <Link
                to="/listadoMisFacturas"
                className={`link ${
                  window.location.pathname === "/listadoMisFacturas"
                    ? "active"
                    : ""
                }`}
              >
                <People />
                <span className="link_name">
                  Listar Mis Facturas <br /> / Boletas
                </span>
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
                <People />
                <span className="link_name">Agregar Inventario</span>
              </Link>

              <Link
                to="/listarInventario"
                className={`link ${
                  window.location.pathname === "/listarInventario"
                    ? "active"
                    : ""
                }`}
              >
                <Inventory />
                <span className="link_name">Listar Inventario</span>
              </Link>
            </nav>

          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
