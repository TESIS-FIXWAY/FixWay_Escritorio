import "../styles/indexAdmin.css";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import Mecanico from "./mecanico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUsersGear,
  faReceipt,
  faBoxesStacked,
  faCartFlatbed,
  faClipboardList,
  faUserPlus,
  faUsersLine,
  faFileCirclePlus,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUsersGear,
  faReceipt,
  faBoxesStacked,
  faCartFlatbed,
  faClipboardList,
  faUserPlus,
  faUsersLine,
  faFileCirclePlus,
  faFileLines
);

const IndexMecanico = () => {
  const navigate = useNavigate();
  const [processCount, setInProcessCount] = useState(0);
  const [pendingCount, setInPendingCount] = useState(0);
  const [deliveredCount, setInDeliveredCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const identifyUser = auth.currentUser;
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        setUser(snapshot.data());
      });
    }
    const fetchMaintenanceCount = async () => {
      try {
        const maintenanceCollection = collection(db, "mantenciones");
        const maintenanceSnapshot = await getDocs(maintenanceCollection);

        const inProcessMaintenance = maintenanceSnapshot.docs.filter(
          (doc) => doc.data().estado === "en proceso"
        );
        const pendingMaintenance = maintenanceSnapshot.docs.filter(
          (doc) => doc.data().estado === "pendiente"
        );
        const deliveredMaintenance = maintenanceSnapshot.docs.filter(
          (doc) => doc.data().estado === "entregados"
        );

        const inProcessCount = inProcessMaintenance.length;
        const inPendingCount = pendingMaintenance.length;
        const inDeliveredCount = deliveredMaintenance.length;

        setInProcessCount(inProcessCount);
        setInPendingCount(inPendingCount);
        setInDeliveredCount(inDeliveredCount);
      } catch (error) {
        console.error("Error fetching maintenance count:", error);
      }
    };

    fetchMaintenanceCount();
  }, []);

  const mantencion = () => {
    navigate("/gestionMantenciones");
  };

  const inventarioMecanico = () => {
    navigate("/listarInventarioMecanico");
  };

  const generadorQR = () => {
    navigate("/generarQR");
  };

  const generadorListadoMantencion = () => {
    navigate("/generarListadoMantencion");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Mecanico />
      <div className="tabla_listar">
        <div className="card_admin_encabezado">
          <div className="card_admin_calendario">
            <div className="calendario">
              <h1 className="">Calendario</h1>
              <Calendar onChange={handleDateChange} value={selectedDate} />
            </div>
          </div>
          <div className="perfil_usuario">
            <h1 className="perfil_usuario_h1">Perfil de Usuario</h1>
            {user && (
              <div className="perfil_usuario_lista">
                <p className="perfil_usuario_lista_p">
                  {" "}
                  <FontAwesomeIcon icon="fa-solid fa-user" />
                  Nombre de Usuario:
                </p>
                <p className="perfil_usuario_lista_p">
                  {user.nombre} {user.apellido}
                </p>
                <p className="perfil_usuario_lista_p">
                  {" "}
                  <FontAwesomeIcon icon="fa-solid fa-id-card" />
                  RUT de Usuario:{" "}
                </p>
                <p className="perfil_usuario_lista_p">{user.rut}</p>
                <p className="perfil_usuario_lista_p">
                  {" "}
                  <FontAwesomeIcon icon="fa-solid fa-envelope" />
                  Correo Electrónico:
                </p>
                <p className="perfil_usuario_lista_p">{user.email}</p>
                <p className="perfil_usuario_lista_p">
                  {" "}
                  <FontAwesomeIcon icon="fa-solid fa-location-dot" />
                  Dirección de Usuario:
                </p>
                <p className="perfil_usuario_lista_p">{user.direccion}</p>
                <p className="perfil_usuario_lista_p">
                  {" "}
                  <FontAwesomeIcon icon="fa-solid fa-phone" />
                  Teléfono de Usuario:
                </p>
                <p className="perfil_usuario_lista_p">{user.telefono}</p>
              </div>
            )}
          </div>
        </div>
        <div className="card_admin_subencabezado">
          <div className="card_admin_mantencion">
            <div className="card_admin_mantencion_in">
              <h1>Mantenciones</h1>
              <hr />
              <p className="card_admin_mantencion_p">
                {" "}
                <FontAwesomeIcon icon="fa-solid fa-rectangle-list" />{" "}
                Mantenciones Pendientes:
              </p>
              <p className="card_admin_mantencion_p">{pendingCount}</p>
              <hr />
              <p className="card_admin_mantencion_p">
                {" "}
                <FontAwesomeIcon icon="fa-solid fa-spinner" /> Mantenciones En
                Proceso:
              </p>
              <p className="card_admin_mantencion_p">{processCount}</p>
              <hr />
              <p className="card_admin_mantencion_p">
                {" "}
                <FontAwesomeIcon icon="fa-regular fa-circle-check" />{" "}
                Mantenciones Entregadas:
              </p>
              <p className="card_admin_mantencion_p">{deliveredCount}</p>
            </div>
          </div>
          <div className="contenedor_cartas_iconos">
            <div className="cartas_iconos" onClick={mantencion}>
              <FontAwesomeIcon
                icon="fa-solid fa-clipboard-list"
                className="functionality_icon"
              />
              <p>Gestion de Mantenciones</p>
            </div>
            <div className="cartas_iconos" onClick={inventarioMecanico}>
              <FontAwesomeIcon
                className="functionality_icon"
                icon="fa-solid fa-list"
              />
              <p>Listar Inventario</p>
            </div>
            <div className="cartas_iconos" onClick={generadorQR}>
              <FontAwesomeIcon
                className="functionality_icon"
                icon="fa-solid fa-qrcode"
              />
              <p>Generar QR</p>
            </div>
            <div className="cartas_iconos" onClick={generadorListadoMantencion}>
              <FontAwesomeIcon
                className="functionality_icon"
                icon="fa-solid fa-file-pdf"
              />
              <p>Generar Listado Mantencion</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexMecanico;
