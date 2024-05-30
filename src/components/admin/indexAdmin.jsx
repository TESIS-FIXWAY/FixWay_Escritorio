import "../styles/indexAdmin.css";
import "../styles/darkMode.css";
import React, { useState, useEffect, useContext } from "react";
import "react-calendar/dist/Calendar.css";
import Admin from "./admin";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { DarkModeContext } from "../../context/darkMode";

import Tierra from "./tierra";
import CarModel from "./auto";

import GraficoMisBoletas from "./graficos/graficoMisBoletas";
import GraficoMisFacturas from "./graficos/graficoMisFacturas";
import HistorialVentas from "./historial/historial";
import GraficoTipoPago from "./graficos/graficoTipoPago";

const IndexAdmin = () => {
  const [user, setUser] = useState(null);
  const [processCount, setInProcessCount] = useState(0);
  const [pendingCount, setInPendingCount] = useState(0);
  const [deliveredCount, setInDeliveredCount] = useState(0);
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
          (doc) => doc.data().estado === "pendiente"
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

  return (
    <div className="layaout">
      <header>
        <Admin />
      </header>
      <aside className={`aside ${isDarkMode ? "dark-mode" : ""}`}>
        <h1 className="titulo-Grafico ">Estadisticas Generales</h1>
        <div>
          <HistorialVentas />
        </div>

        <div className="informacion_widgets_index">
          <div className="widgets_historial">
            <div
              className={`container_widgets ${isDarkMode ? "dark-mode" : ""}`}
            >
              <p>Mantenciones Pendientes:</p>
              <p>{pendingCount}</p>
            </div>
            <div
              className={`container_widgets ${isDarkMode ? "dark-mode" : ""}`}
            >
              <p>Mantenciones En Proceso:</p>
              <p>{processCount}</p>
            </div>
            <div
              className={`container_widgets ${isDarkMode ? "dark-mode" : ""}`}
            >
              <p>Mantenciones Entregadas:</p>
              <p>{deliveredCount}</p>
            </div>
          </div>
          <div className={`chart_container ${isDarkMode ? "dark-mode" : ""}`}>
            <div>
            <h1 className="titulo-Grafico ">Tipo de Pago</h1>
              <GraficoTipoPago />
            </div>
          </div>
        </div>
      </aside>

      <main className={`main ${isDarkMode ? "dark-mode" : ""}`}>
        <div>
          <GraficoMisFacturas />
        </div>
        {/* <div><CarModel /></div> */}
        <div>
          <GraficoMisBoletas />
        </div>
      </main>
    </div>
  );
};

export default IndexAdmin;
