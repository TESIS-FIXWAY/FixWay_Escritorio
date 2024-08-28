import "./styles/login.css";
import Car from "../images/logoSinfondo.png";
import React, { useState, useEffect } from "react";
import { db, auth } from "../dataBase/firebase";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUserWithFirebaseAndRol(usuarioFirebase);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  async function getRol(uid) {
    const docuRef = doc(db, `users/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    if (docuCifrada.exists()) {
      return docuCifrada.data().rol;
    } else {
      throw new Error("El usuario no está registrado en la colección.");
    }
  }

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid)
      .then((rol) => {
        const userData = {
          uid: usuarioFirebase.uid,
          email: usuarioFirebase.email,
          rol: rol,
        };
        setUser(userData);
      })
      .catch((error) => {
        console.error(error.message);
        setError("Usuario no registrado.");
        auth.signOut();
      });
  }

  async function handleSumit(e) {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed", error.message);
      setError("Correo o contraseña incorrectos.");
    }
  }

  useEffect(() => {
    if (user) {
      user.rol === "administrador"
        ? navigate("/indexAdmin")
        : navigate("/indexMecanico");
    }
  }, [user, navigate]);

  return (
    <>
      <div className="body">
        <div className="container_form">
          <div className="informacion">
            <div className="info">
              <h2>Bienvenido</h2>
              <img src={Car} alt="logo" className="imagen" />
              <p>Taller Mecánico</p>
            </div>
          </div>
          <div className="form-informacion">
            <div className="form-info-childs">
              <h2>Login</h2>
              <form className="formulario" onSubmit={handleSumit}>
                <label className="label-login">
                  <i className="bx bx-envelope"></i>
                  <input type="email" placeholder="Email" id="email" />
                </label>
                <br />
                <label className="label-login">
                  <i className="bx bx-lock-alt"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    id="password"
                  />
                </label>
                <br />
                <input
                  type="submit"
                  value="Iniciar Sesión"
                  className="btn-enviar"
                />
              </form>
              {error && <p style={{ marginTop: 10, fontSize: 15 }}>{error}</p>}
              <br />
              <Link to="/recuperarContrasena" className="resetPassword">
                Olvidé mi Contraseña
              </Link>
            </div>
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

export default Login;
