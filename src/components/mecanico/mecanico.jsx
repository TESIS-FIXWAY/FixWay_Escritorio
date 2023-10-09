import React from 'react';
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import logo from '../../images/logo.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUser,
  faTrash,
  faUsers,
  faFileInvoice,
  faChartSimple,
  faCoins,
  faDatabase,
  faTableList,
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUser,
  faTrash,
  faFileInvoice,
  faChartSimple,
  faCoins,
  faDatabase,
  faTableList,
  faAngleUp,
);

const Mecanico = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log(user);
      alert('Se ha cerrado la sesión');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div id="nav-bar">
    <input id="nav-toggle" type="checkbox"/>
    <div id="nav-header">
      <span id="nav-title">Hans<i className="fab fa-codepen"></i>Motors</span>
      <label for="nav-toggle"><span id="nav-toggle-burger"></span></label>
      <hr/>
    </div>
    <div id="nav-content">
      <div className="nav-button">
        <FontAwesomeIcon icon={faUser} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Agregar Mantencion</span>
      </div>
      <div className="nav-button">
        <FontAwesomeIcon icon={faTrash} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Eliminar Mantencion</span>
      </div>
      <div className="nav-button">
        <FontAwesomeIcon icon={faUsers} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Listado Mantencion</span>
      </div>
      <hr/>
      <div className="nav-button">
        <FontAwesomeIcon icon={faFileInvoice} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Ingresar Facturas</span>
      </div>
      <div className="nav-button">
        <FontAwesomeIcon icon={faChartSimple} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Visualizar Facturas</span>
      </div>
      <div className="nav-button">
        <FontAwesomeIcon icon={faCoins} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Visualizar Presupuesto</span>
      </div>
      <div className="nav-button">
        <FontAwesomeIcon icon={faDatabase} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Base Datos</span>
      </div>
      <hr/>
      <div className="nav-button">
        <FontAwesomeIcon icon={faTableList} style={{width: '8%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        <span>Lista de Trabajos</span>
      </div>
      <div id="nav-content-highlight"></div>
    </div>
    <input id="nav-footer-toggle" type="checkbox"/>
    <div id="nav-footer">
      <div id="nav-footer-heading">
        <div id="nav-footer-avatar">
          {/* <img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAklJREFUWEftmNtNxDAQRWcrASoBKgEqASoBKgEqgU5AB/muJhM/xiEfK4SlCBHG9vGdl8PBTmwcTozH/gzQrZldmtm5exD7szzvZvbmfk87YlYhQO4LRGYTAB8d3HBOFujKzJ4mQOLGgN0VsC5UBuihqDI8XcIAtZ6LK6vmI6BXM0OdPQdQHHIa6LfKoEQMekE0oVoKEbzEzOwgsxTEfm4tGS5qrmsBfc2SlIC9LvNQBgiVAUB5RwjwUyUCe2yOowa0xVUsyokZ2vTFzM4KAHWJdePaK9fVgLaoo4XZkIIppQBEEdwvV344lVDO265aB5OZMDtYlMWZu3JDyVSyFWDgcKfGIpaiQnu4iwK4iIsCgHL8reu2CLSl7kgdxQ+xQ8r7gSrEEe+jQrwD9GdEoNn4iTGgTAJKxS/GVdzDJ8QKCD/fFJ8rPVvxtFjIGSmINT/C0Zz96AJ5Q04GXAvMuyqTBK1imwbSJqimKwdwLOBPPYIBRKrXbKeBPBiTfaWN2SRbuS3TmBdxOOr2rdPrflRTarYPLqp1BNKJoM4MCqG/eG0pG93CCASbKE50L27BqeJiv+VGucrUTHPt3fJUa2iivh1k1MUm1Vylkk93NUbeSTXFEZL7hpmFqdaxVlDXehobqwTonkNQk9Jb1KnWsV6W1aAUwACN6ktPqekrrBaLjTDrjp7doplGw0wd2hOq+8VR6/a99J75Yo3r7PqhONNwawci7uL9qOnSjMtqk8k2Hv3DARs1Xp+B2Yp/3GMr0B7BXV3jH2gk7TfbUZYllLE9IwAAAABJRU5ErkJggg=="} alt='log'/> */}
          <img src={logo} alt='log'/>
        </div>
        <div id="nav-footer-titlebox">
          <span id="nav-footer-title">{user.email}</span>
          <span id="nav-footer-subtitle">Mecanico</span>
        </div>
        <label for="nav-footer-toggle">
          <FontAwesomeIcon icon={faAngleUp} style={{width: '24%', display:'flex', justifyContent:'center', alignItems:'center', padding:'15px'}} />
        </label>
      </div>
      <div id="nav-footer-content">
        <div className="nav-footer-button">
          <input 
            id='nav-footer-button'
            type="submit"
            onClick={handleLogout} 
            value="Cerrar sesion"
            />
        </div>
      </div>
    </div>
  </div>
  )
}

export default Mecanico;