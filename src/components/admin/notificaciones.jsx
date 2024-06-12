import React, { useEffect, useState, useContext } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, db } from "../../firebase";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import { collection, onSnapshot } from "firebase/firestore";
import { styled } from "@mui/system";
import { DarkModeContext } from "../../context/darkMode";

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
  const [isTrayVisible, setIsTrayVisible] = useState(true);

  const formatoDinero = (amount) => {
    if (amount === undefined || amount === null) {
      return "0";
    }
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const translateEstado = (tipoPago) => {
    switch (tipoPago) {
      case "credito":
        return "Crédito";
      case "contado":
        return "Contado";
      case "debito":
        return "Débito";
      default:
        return tipoPago;
    }
  };

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
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        {
          title: payload.notification.title,
          body: payload.notification.body,
          severity: "info",
        },
      ]);
    });

    const unsubFirestoreUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const user = change.doc.data();
          console.log(`Change detected: ${change.type}`, change.doc.id, user);

          if (change.type === "added") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Nuevo usuario agregado",
                body: `Se ha agregado un nuevo usuario: ${user.nombre} ${user.apellido}`,
                severity: "info",
              },
            ]);
          } else if (change.type === "modified") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Usuario modificado",
                body: `Se ha modificado el usuario: ${user.nombre}`,
                severity: "info",
              },
            ]);
          } else if (change.type === "removed") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Usuario eliminado",
                body: `Se ha eliminado el usuario: ${user.nombre} ${user.apellido}`,
                severity: "error",
              },
            ]);
          }
        });
      }
    );

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
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Nueva mantención agregada",
                body: `Se ha agregado una mantención con ID: ${change.doc.id}`,
                severity: "info",
              },
            ]);
          } else if (change.type === "modified") {
            if (mantencion.estado === "en proceso") {
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                {
                  title: "Mantención en proceso",
                  body: `La mantención con ID ${change.doc.id} está en proceso.`,
                  severity: "info",
                },
              ]);
            } else if (mantencion.estado === "terminado") {
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                {
                  title: "Mantención Terminada",
                  body: `Se ha finalizado la mantención con éxito: ${change.doc.id}`,
                  severity: "success",
                },
              ]);
            } else {
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                {
                  title: "Estado de Mantención modificado",
                  body: `Se ha modificado el estado: ${mantencion.estado}`,
                  severity: "info",
                },
              ]);
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
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Inventario modificado",
                body: `Se ha modificado el inventario con ID: ${change.doc.id}`,
                severity: "info",
              },
            ]);

            if (inventario.stock === 0) {
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                {
                  title: "Producto sin stock",
                  body: `El producto con ID ${change.doc.id} no tiene stock.`,
                  severity: "error",
                },
              ]);
            } else if (inventario.stock < 10) {
              setNotifications((prevNotifications) => [
                ...prevNotifications,
                {
                  title: "Stock bajo",
                  body: `El producto con ID ${change.doc.id} tiene menos de 10 unidades en stock.`,
                  severity: "warning",
                },
              ]);
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
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Nuevo automóvil agregado",
                body: `Se ha agregado un nuevo automóvil: ${change.doc.id}`,
                severity: "info",
              },
            ]);
          } else if (change.type === "modified") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Automóvil modificado",
                body: `Se ha modificado el automóvil: ${change.doc.id}`,
                severity: "info",
              },
            ]);
          } else if (change.type === "removed") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Automóvil eliminado",
                body: `Se ha eliminado el automóvil: ${change.doc.id}`,
                severity: "error",
              },
            ]);
          }
        });
      }
    );

    const unsubFirestoreHistorialVentas = onSnapshot(
      collection(db, "historialVentas"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const historialVentas = change.doc.data();
          console.log(
            `Change detected: ${change.type}`,
            change.doc.id,
            historialVentas
          );

          if (change.type === "added") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Nueva venta registrada",
                body: `Con tipo de pago: ${translateEstado(
                  historialVentas.tipoPago
                )}, total: $${formatoDinero(historialVentas.totalCompra)}`,
                severity: "info",
              },
            ]);
          }
        });
      }
    );

    const unsubFirestoreFacturas = onSnapshot(
      collection(db, "facturas"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const facturas = change.doc.data();
          console.log(
            `Change detected: ${change.type}`,
            change.doc.id,
            facturas
          );

          if (change.type === "added") {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              {
                title: "Nueva factura registrada",
                body: `Nueva factura registrada con ID: ${
                  change.doc.id
                }, monto total: $${formatoDinero(facturas.montoTotal)}`,
                severity: "info",
              },
            ]);
          }
        });
      }
    );

    requestPermission();

    return () => {
      unsubFirestoreUsers();
      unsubFirestoreMantenciones();
      unsubFirestoreInventario();
      unsubFirestoreAutomovil();
      unsubFirestoreHistorialVentas();
      unsubFirestoreFacturas();
    };
  }, []);

  return (
    <>
      {isTrayVisible && (
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
      )}
    </>
  );
};

export default Notificacion;
