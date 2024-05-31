import "../styles/indexAdmin.css";
import "../styles/darkMode.css";
import { DarkModeContext } from "../../context/darkMode";
import React, { useState, useEffect, useContext } from "react";
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
  const { isDarkMode } = useContext(DarkModeContext);

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
          (doc) =>
            doc.data().estado === "pendiente" ||
            doc.data().estado === "atencion_especial" ||
            doc.data().estado === "prioridad"
        );
        const deliveredMaintenance = maintenanceSnapshot.docs.filter(
          (doc) => doc.data().estado === "terminado"
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="layaout">
        <header>
          <Mecanico />
        </header>
        <div className="tabla_listar">
          <div className="card_admin_encabezado">
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
          <aside className={`aside ${isDarkMode ? "dark-mode" : ""}`}>
            <h1 className="titulo-Grafico ">Información General</h1>
            <div className="informacion_widgets_index">
              <div className="widgets_historial">
                <div
                  className={`container_widgets ${
                    isDarkMode ? "dark-mode" : ""
                  }`}
                >
                  <p>Mantenciones Pendientes:</p>
                  <p>{pendingCount}</p>
                </div>
                <div
                  className={`container_widgets ${
                    isDarkMode ? "dark-mode" : ""
                  }`}
                >
                  <p>Mantenciones En Proceso:</p>
                  <p>{processCount}</p>
                </div>
                <div
                  className={`container_widgets ${
                    isDarkMode ? "dark-mode" : ""
                  }`}
                >
                  <p>Mantenciones Entregadas:</p>
                  <p>{deliveredCount}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default IndexMecanico;
