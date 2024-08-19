import "../components/styles/recuperarContrasena.css";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link} from "react-router-dom";
import Car from "../images/logoSinfondo.png";

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
    <>
      <div className="body">
        <div className="container_form">

          <div className="informacion">
            <div className="info">
              <h2>Recupera tu contraseña</h2>
              <img src={Car} alt="logo" className="imagen" />
            </div>
          </div>

          <div className="form-informacion">
          {emailSent ? (
              <p>
                Se ha enviado un correo electrónico con instrucciones para restablecer
                tu contraseña.
              </p>
            ) : (
              <>
                <form className="formulario">
                  <label className="label-login">
                    <i className="bx bx-lock-alt"></i>
                    <input
                      type="email"
                      label="Correo Electrónico"
                      placeholder="Correo Electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <br />
                  <Button
                    onClick={handleForgotPassword}
                    variant="outlined"
                    className="btn-enviar"
                  >
                    Enviar
                  </Button>
                  <br />
                  <br />
                  <Link to="/" className="resetPassword">
                    Iniciar sesion
                  </Link>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </>
            )}
            
          </div>
          
        </div>
        <footer className="footer_login">
          <div className="waves">
            <div className="wave" id="wave1"></div>
            <div className="wave" id="wave2"></div>
            <div className="wave" id="wave3"></div>
            <div className="wave" id="wave4"></div>
          </div>
          <h1>CONTACTOS</h1>
          <ul className="menu_footer">
            <li>
              {" "}
              <a href="#">Samuel Gajardo</a>
            </li>
            <li>
              {" "}
              <a href="#">Sebastián Quintana</a>
            </li>
            <li>
              {" "}
              <a href="#">Benjamín Garrido</a>
            </li>
          </ul>
          <ul className="menu_footer">
            <li>
              {" "}
              <a href="#">+56 9 9773 1366</a>
            </li>
            <li>
              {" "}
              <a href="#">+56 9 5641 4395</a>
            </li>
            <li>
              {" "}
              <a href="#">+56 9 8470 9534</a>
            </li>
          </ul>
          <p>©2024 Instituto Inacap | Programadores </p>
        </footer>
        </div>

    </>

  );
};

export default RecuperarContrasena;
