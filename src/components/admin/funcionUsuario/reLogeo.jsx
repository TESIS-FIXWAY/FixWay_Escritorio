import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../firebase";

const ReLogeo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Evitar el envío del formulario por defecto

    try {
      // Cerrar sesión primero
      await signOut(auth);

      // Luego, iniciar sesión con los datos del formulario
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
      <p>{mensaje}</p>
    </div>
  );
};

export default ReLogeo;
