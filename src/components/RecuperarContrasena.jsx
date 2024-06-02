import "../components/styles/recuperarContrasena.css";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const RecuperarContrasena = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmailSent(true);
        setTimeout(() => {
          navigate("/");
        }, 6000);
      })
      .catch((error) => {
        setError(
          "No se pudo enviar el correo electrónico de restablecimiento de contraseña."
        );
      });
  };

  return (
    <div className="recuperar-contrasena">
      <h1>Recuperar Contraseña</h1>
      {emailSent ? (
        <p>
          Se ha enviado un correo electrónico con instrucciones para restablecer
          tu contraseña.
        </p>
      ) : (
        <>
          <TextField
            type="email"
            label="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ width: "16%" }}
          />
          <Button
            onClick={handleForgotPassword}
            variant="outlined"
            sx={{
              fontSize: "19px",
              marginBottom: "19px",
              top: "10px",
            }}
          >
            Enviar
          </Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default RecuperarContrasena;
