import "../styles/indexAdmin.css";
import "../styles/darkMode.css";
import React, { useState, useEffect, useContext } from "react";
import "react-calendar/dist/Calendar.css";
import Vendedor from "./vendedor";
import { db, auth } from "../../dataBase/firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { DarkModeContext } from "../../context/darkMode";

import GraficosMisBoletasVendedor from "./Graficos/graficosMisBoletasVendedor";
import GraficoMisFacturasVendedor from "./Graficos/graficosMisFacturasVendedor";
import HistorialVentas from "../admin/historial/historial";
import GraficoTipoPagoVendedor from "./Graficos/graficoTipoPagoVendedor";

const IndexVendedor = () => {
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

  return (
    <div className="layaout">
      <header>
        <Vendedor />
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
              <GraficoTipoPagoVendedor />
            </div>
          </div>
        </div>
      </aside>
      <main className={`main ${isDarkMode ? "dark-mode" : ""}`}>
        <div>
          <GraficosMisBoletasVendedor />
        </div>
        <div>
          <GraficoMisFacturasVendedor />
        </div>
      </main>
    </div>
  );
};

export default IndexVendedor;
