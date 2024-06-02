import React, { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, db } from "../../firebase";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { collection, onSnapshot } from "firebase/firestore";

const NotificacionMecanico = () => {
  const [notification, setNotification] = useState(null);
  const [severity, setSeverity] = useState("info");

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BBVssF1NWwQCwX4w0gamt8rtAwCqE-ZlB6pR_F06sVMg3ZNQ0dPm-d-ac7eDYNlx8dKg1tK6WiNKKWIHEp6A180",
        });
        console.log("FCM Token:", token);
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    };

    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      setNotification(payload.notification);
      setSeverity("info");
    });

    const unsubFirestoreMantenciones = onSnapshot(
      collection(db, "mantenciones"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const mantencion = change.doc.data();
          console.log(
            `Change detected: ${change.type}`,
            change.doc.id,
            mantencion
          );

          if (change.type === "added") {
            setNotification({
              title: "Nueva mantención agregada",
              body: `Se ha agregado una mantención con ID: ${change.doc.id}`,
            });
            setSeverity("info");
          } else if (change.type === "modified") {
            if (mantencion.estado === "en proceso") {
              setNotification({
                title: "Mantención en proceso",
                body: `La mantención con ID ${change.doc.id} está en proceso.`,
              });
              setSeverity("info");
            } else if (mantencion.estado === "terminado") {
              setNotification({
                title: "Mantención Terminada",
                body: `Se ha finalizado la mantención con éxito: ${change.doc.id}`,
              });
              setSeverity("success");
            } else {
              setNotification({
                title: "Estado de Mantención modificado",
                body: `Se ha modificado el estado: ${mantencion.estado}`,
              });
              setSeverity("info");
            }
          }
        });
      }
    );

    const unsubFirestoreInventario = onSnapshot(
      collection(db, "inventario"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const inventario = change.doc.data();
          console.log(
            `Change detected: ${change.type}`,
            change.doc.id,
            inventario
          );

          if (change.type === "modified") {
            setNotification({
              title: "Inventario modificado",
              body: `Se ha modificado el inventario con ID: ${change.doc.id}`,
            });
            setSeverity("info");

            if (inventario.stock === 0) {
              setNotification({
                title: "Producto sin stock",
                body: `El producto con ID ${change.doc.id} no tiene stock.`,
              });
              setSeverity("error");
            } else if (inventario.stock < 10) {
              setNotification({
                title: "Stock bajo",
                body: `El producto con ID ${change.doc.id} tiene menos de 10 unidades en stock.`,
              });
              setSeverity("warning");
            }
          }
        });
      }
    );

    const unsubFirestoreAutomovil = onSnapshot(
      collection(db, "automoviles"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const automoviles = change.doc.data();
          console.log(
            `Change detected: ${change.type}`,
            change.doc.id,
            automoviles
          );

          if (change.type === "added") {
            setNotification({
              title: "Nuevo automóvil agregado",
              body: `Se ha agregado un nuevo automóvil: ${change.doc.id}`,
            });
            setSeverity("info");
          } else if (change.type === "modified") {
            setNotification({
              title: "Automóvil modificado",
              body: `Se ha modificado el automóvil: ${change.doc.id}`,
            });
            setSeverity("info");
          } else if (change.type === "removed") {
            setNotification({
              title: "Automóvil eliminado",
              body: `Se ha eliminado el automóvil: ${change.doc.id}`,
            });
            setSeverity("error");
          }
        });
      }
    );

    requestPermission();

    return () => {
      unsubFirestoreMantenciones();
      unsubFirestoreInventario();
      unsubFirestoreAutomovil();
    };
  }, []);

  return (
    <div>
      {notification && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity={severity}
          onClose={() => setNotification(null)}
          style={{ marginBottom: "20px" }}
        >
          <strong>{notification.title}</strong>
          <p>{notification.body}</p>
        </Alert>
      )}
    </div>
  );
};

export default NotificacionMecanico;
