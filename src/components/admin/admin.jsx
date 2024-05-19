import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import Logo from "../../images/LogoSinFoindo.png";

// import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
// import { TreeItem } from '@mui/x-tree-view/TreeItem';

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

import "../styles/admin.css";



const Admin = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen1, setIsSubMenuOpen1] = useState(false);
  const [isSubMenuOpen2, setIsSubMenuOpen2] = useState(false);
  const [isSubMenuOpen3, setIsSubMenuOpen3] = useState(false);



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
    setIsSubMenuOpen2(false); // Cierra el otro submenú
    setIsSubMenuOpen3(false); // Cierra el otro submenú

  };
  
  const toggleSubMenu2 = () => {
    setIsSubMenuOpen2(!isSubMenuOpen2);
    setIsSubMenuOpen1(false); // Cierra el otro submenú
    setIsSubMenuOpen3(false); // Cierra el otro submenú
  };
  const toggleSubMenu3 = () => {
    setIsSubMenuOpen3(!isSubMenuOpen3);
    setIsSubMenuOpen1(false); // Cierra el otro submenú
    setIsSubMenuOpen2(false); // Cierra el otro submenú
  };

  return (
    <>

      <header className="encabezado">
        <div className="logo">
          <Link to="/indexAdmin" >
            <img src={Logo} alt="logo" />
          </Link>
        </div>

        <nav className={`arbol ${isMenuOpen ? 'open' : ''}`}>

          <ul className="arbolitos">

            <li onClick={toggleSubMenu1}>
              <Link
                className={`links ${
                  window.location.pathname === "/agregarUsuario" || window.location.pathname === "/listarUsuario" ? "active" : ""
                }`}
              >
                <span className="link_name">Usuarios</span>
              </Link>              
              {isSubMenuOpen1  && (
                <ul className="sub-menu">
                  <li>
                    <Link itemId="pickers-community"
                      to="/agregarUsuario"
                      className={`link ${
                        window.location.pathname === "/agregarUsuario" ? "active" : ""
                      }`}>
                      <span className="link_name">Crear Usuarios</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/listarUsuario"
                      className={`link ${
                        window.location.pathname === "/listarUsuario" ? "active" : ""
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
                  window.location.pathname === "/generarFactura" || window.location.pathname === "/agregarFactura" ? "active" : ""
                }`}>
                <span className="link_name">Facturas</span>
              </Link>              
              {isSubMenuOpen2  && (
                <ul className="sub-menu">
                  <li>
                  <Link
                      to="/generarFactura"
                      className={`link ${
                        window.location.pathname === "/generarFactura" ? "active" : ""
                      }`}
                    >
                      <ReceiptLong />
                      <span className="link_name">Generar Factura</span>
                    </Link>
                  </li>
                  <li>
                  <Link
                    to="/agregarFactura"
                    className={`link ${
                      window.location.pathname === "/agregarFactura" ? "active" : ""
                    }`}
                  >
                    <PostAdd />
                    <span className="link_name">Agregar Factura de Proveedor</span>
                  </Link>
                  </li>
                </ul>
              )}
            </li>

            <li onClick={toggleSubMenu3}>
              <Link
                className={`links ${
                  window.location.pathname === "/listadoFacturas" || window.location.pathname === "/listadoMisFacturas" ? "active" : ""
                }`}>
                <span className="link_name">Mis Facturas</span>
              </Link>              
              {isSubMenuOpen3  && (
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
                      <People />
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
                      <People />
                      <span className="link_name">
                        Listar Mis Facturas/Boletas
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>



          </ul>

        </nav>



        <button type="submit" onClick={handleLogout} className="boton_salir">
          <Logout />
        </button>

        <button className="menu-toggle" onClick={toggleMenu}>
          <Menu  className="menu_ico"/>
        </button>

      </header>

      {/* <div>

        <header className="header">
          <div className="contenedor-header">
            
            <div className="btn-menu">              
              <Link to="/indexAdmin" >
                <label >
                  <Home className="menu_home"/>
                </label>
              </Link>
            </div>
            <div className="logo">
              <h1>Settore</h1>
            </div>


            
            <div className="arboles">
            <Link to="/gestionMantencionesAdmin"
                className={`link ${
                  window.location.pathname === "/gestionMantencionesAdmin"
                    ? "active"
                    : ""
                }`}
              >
                <span>Mantenciones</span>
              </Link>
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



        <input type="checkbox" id="btn-menu" checked></input>  

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
      </div>  */}
    </>
  );
};

export default Admin;
