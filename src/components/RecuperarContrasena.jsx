import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

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
      <h2>Recuperar Contraseña</h2>
      {emailSent ? (
        <p>
          Se ha enviado un correo electrónico con instrucciones para restablecer
          tu contraseña.
        </p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleForgotPassword}>Enviar</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default RecuperarContrasena;
