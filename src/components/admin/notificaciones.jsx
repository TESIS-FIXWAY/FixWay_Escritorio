import React, { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, db } from "../../firebase";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { collection, onSnapshot } from "firebase/firestore";

const Notificacion = () => {
  const [notification, setNotification] = useState(null);

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
    });

    const unsubFirestore = onSnapshot(collection(db, "users"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const user = change.doc.data();
        console.log(`Change detected: ${change.type}`, change.doc.id, user);

        if (change.type === "added") {
          setNotification({
            title: "Nuevo usuario agregado",
            body: `Se ha agregado un nuevo usuario: ${user.nombre} ${user.apellido}`,
          });
        } else if (change.type === "modified") {
          setNotification({
            title: "Usuario modificado",
            body: `Se ha modificado el usuario: ${user.nombre}`,
          });
        } else if (change.type === "removed") {
          setNotification({
            title: "Usuario eliminado",
            body: `Se ha eliminado el usuario: ${user.nombre}`,
          });
        }
      });
    });

    requestPermission();

    return () => {
      unsubFirestore();
    };
  }, []);

  return (
    <div>
      {notification && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="info"
          onClose={() => setNotification(null)}
          style={{ marginBottom: "10px" }}
        >
          <strong>{notification.title}</strong>
          <p>{notification.body}</p>
        </Alert>
      )}
    </div>
  );
};

export default Notificacion;
