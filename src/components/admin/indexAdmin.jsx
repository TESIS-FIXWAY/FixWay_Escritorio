import "../styles/indexAdmin.css";
import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import Admin from "./admin";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
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
  faEnvelope,
  faLocationDot,
  faPhone,
  faSpinner,
  faRectangleList,
  faIdCard,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";
import {
  faAddressCard,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
library.add(
  faUsersGear,
  faReceipt,
  faBoxesStacked,
  faCartFlatbed,
  faClipboardList,
  faUserPlus,
  faUsersLine,
  faFileCirclePlus,
  faFileLines,
  faEnvelope,
  faLocationDot,
  faPhone,
  faAddressCard,
  faSpinner,
  faRectangleList,
  faCircleCheck,
  faIdCard,
  faChartColumn
);
import GraficoMisBoletas from "./graficos/graficoMisBoletas";
import GraficoMisFacturas from "./graficos/graficoMisFacturas";
import HistorialVentas from "./historial/historial";
import GraficoMantenciones from "./graficos/graficoMantencion";

const IndexAdmin = () => {
  const [user, setUser] = useState(null);
  const [processCount, setInProcessCount] = useState(0);
  const [pendingCount, setInPendingCount] = useState(0);
  const [deliveredCount, setInDeliveredCount] = useState(0);

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
    <>

      <style>
        @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
      </style>


      <div class="layout">
        <header class="header">
          <Admin />
        </header>
        <div class="content">
          <nav class="sidebar"> 
            <HistorialVentas /> 
          </nav>

          <div class="main-container">
            <main className="main">
              <div className="graficos-wrapper">
                <GraficoMisFacturas />
                <GraficoMisBoletas />
              </div>
            </main>

            <div class="widget-estadisticas-container">

              <article class="widget">
                <GraficoMantenciones />
              </article>

              <article class="estadisticas">
                <div class="container_mantenciones">
                  <h1>Mantenciones</h1>

                  <div class="subtitulos">
                    <div>
                      <FontAwesomeIcon icon="fa-solid fa-spinner" />
                      <p>Pendientes:</p>
                      <p>{pendingCount}</p>
                    </div>
                    <div>
                      <FontAwesomeIcon icon="fa-solid fa-spinner" />
                      <p> En Proceso:</p>
                      <p>{processCount}</p>
                    </div>
                    <div>
                      <FontAwesomeIcon icon="fa-regular fa-circle-check" />
                      <p>Entregadas:</p>
                      <p>{deliveredCount}</p>
                    </div>
                  </div>

                </div>
              </article>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexAdmin;
