import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";

const ReLogeo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    try {
      // Cerrar sesión primero
      await auth.signOut();

      // Luego, iniciar sesión con los nuevos datos
      await signInWithEmailAndPassword(auth, email, password);
      setMensaje("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      setMensaje("Error durante el inicio de sesión");
    }
  };

  const handleCancel = () => {
    // Limpiar campos y resetear mensaje
    setEmail("");
    setPassword("");
    setMensaje("");
  };

  const handleAddUser = async () => {
    try {
      const newUserEmail = prompt(
        "Ingrese el correo electrónico del nuevo usuario:"
      );
      const newUserPassword = prompt(
        "Ingrese la contraseña del nuevo usuario:"
      );

      if (newUserEmail && newUserPassword) {
        await createUserWithEmailAndPassword(
          auth,
          newUserEmail,
          newUserPassword
        );
        setMensaje("Usuario agregado exitosamente");
      } else {
        setMensaje(
          "Por favor, ingrese un correo electrónico y una contraseña válidos"
        );
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      setMensaje("Error al agregar usuario");
    }
  };

  return (
    <div>
      <h1>Reiniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <TextField
          label="Correo Electrónico"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <TextField
          label="Contraseña"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <Button variant="contained" type="submit">
          Aceptar
        </Button>
        <Button variant="contained" onClick={handleCancel}>
          Cancelar
        </Button>
      </form>
      <Button variant="contained" onClick={handleAddUser}>
        Agregar Usuario
      </Button>
      <p>{mensaje}</p>
    </div>
  );
};

export default ReLogeo;
