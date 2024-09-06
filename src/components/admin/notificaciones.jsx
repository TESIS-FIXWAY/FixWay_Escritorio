import React, { useEffect, useState, useContext } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, db } from "../../dataBase/firebase";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { styled } from "@mui/system";
import { DarkModeContext } from "../../context/darkMode";
import { format, subDays } from "date-fns";

const Notificacion = () => {
  const { isDarkMode } = useContext(DarkModeContext);

  const NotificationContainer = styled("div")({
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
  });

  const NotificationList = styled("div")({
    maxHeight: "400px",
    overflowY: "auto",
    paddingRight: "10px",
  });

  const Notification = styled(Alert)({
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    borderRadius: "8px",
    padding: "10px 20px",
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
    backgroundColor: isDarkMode ? "#555" : "#fff",
  });

  const NotificationTitle = styled("strong")({
    fontWeight: "bold",
    marginRight: "10px",
    color: isDarkMode ? "#fff" : "#b4b4b4",
  });

  const NotificationBody = styled("p")({
    margin: 0,
    color: isDarkMode ? "#ccc" : "#666",
  });

  const [notifications, setNotifications] = useState([]);
  const [notificationIds, setNotificationIds] = useState([]);

  const MAX_NOTIFICATIONS = 5;
  const DAYS_BACK = 7; // Cantidad de días atrás para mostrar notificaciones recientes

  useEffect(() => {
    const addNotification = (newNotification) => {
      setNotifications((prevNotifications) => {
        // Filtrar notificaciones duplicadas
        const updatedNotifications = [
          newNotification,
          ...prevNotifications.filter(
            (notif) => notif.id !== newNotification.id
          ),
        ];

        // Limitar el número de notificaciones
        if (updatedNotifications.length > MAX_NOTIFICATIONS) {
          updatedNotifications.pop();
        }

        return updatedNotifications;
      });
      setNotificationIds((prevIds) => [...prevIds, newNotification.id]);
    };

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

    // Obtener fecha límite para las notificaciones recientes
    const currentDate = new Date();
    const sevenDaysAgo = subDays(currentDate, DAYS_BACK);

    // Obtener notificaciones recientes en tiempo real desde Firestore
    const unsubFirestoreUsers = onSnapshot(
      query(
        collection(db, "users"),
        where("timestamp", ">=", sevenDaysAgo), // Filtrar por notificaciones recientes
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const user = change.doc.data();
          const id = change.doc.id;
          if (!notificationIds.includes(id)) {
            if (change.type === "added") {
              addNotification({
                id,
                title: "Nuevo usuario agregado",
                body: `Se ha agregado un nuevo usuario: ${user.nombre} ${user.apellido}`,
                severity: "info",
              });
            } else if (change.type === "modified") {
              addNotification({
                id,
                title: "Usuario modificado",
                body: `Se ha modificado el usuario: ${user.nombre}`,
                severity: "info",
              });
            } else if (change.type === "removed") {
              addNotification({
                id,
                title: "Usuario eliminado",
                body: `Se ha eliminado el usuario: ${user.nombre} ${user.apellido}`,
                severity: "error",
              });
            }
          }
        });
      }
    );

    // Agregar otros listeners como `mantenciones`, `inventario`, etc.
    // Todos deberían usar el filtro similar de `timestamp >= sevenDaysAgo`.

    const unsubFirestoreMantenciones = onSnapshot(
      query(
        collection(db, "mantenciones"),
        where("timestamp", ">=", sevenDaysAgo), // Filtrar mantenciones recientes
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const mantencion = change.doc.data();
          const id = change.doc.id;

          if (change.type === "added") {
            addNotification({
              id,
              title: "Nueva mantención agregada",
              body: `Se ha agregado una mantención con ID: ${id}`,
              severity: "info",
            });
          } else if (change.type === "modified") {
            if (mantencion.estado === "en proceso") {
              addNotification({
                id,
                title: "Mantención en proceso",
                body: `La mantención con ID ${id} está en proceso.`,
                severity: "info",
              });
            } else if (mantencion.estado === "terminado") {
              addNotification({
                id,
                title: "Mantención Terminada",
                body: `Se ha finalizado la mantención con éxito: ${id}`,
                severity: "success",
              });
            } else {
              addNotification({
                id,
                title: "Estado de Mantención modificado",
                body: `Se ha modificado el estado: ${mantencion.estado}`,
                severity: "info",
              });
            }
          }
        });
      }
    );

    // Repite el mismo proceso para otras colecciones con `sevenDaysAgo` como filtro.

    // Agregar manejador para mensajes de FCM
    onMessage(messaging, (payload) => {
      addNotification({
        id: payload.messageId,
        title: payload.notification.title,
        body: payload.notification.body,
        severity: "info",
      });
    });

    requestPermission();

    return () => {
      unsubFirestoreUsers();
      unsubFirestoreMantenciones();
      // Agrega limpieza para otros listeners también
    };
  }, [notificationIds]);

  return (
    <NotificationContainer>
      <NotificationList>
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            icon={<CheckIcon fontSize="inherit" />}
            severity={notification.severity}
            onClose={() =>
              setNotifications((prevNotifications) =>
                prevNotifications.filter((_, i) => i !== index)
              )
            }
          >
            <NotificationTitle>{notification.title}</NotificationTitle>
            <NotificationBody>{notification.body}</NotificationBody>
          </Notification>
        ))}
      </NotificationList>
    </NotificationContainer>
  );
};

export default Notificacion;
