// Componente Login:

// Este componente React implementa la interfaz de inicio de sesión de la aplicación para usuarios.
// Utiliza Firebase Authentication para gestionar la autenticación de usuarios.

// Funciones y Características Principales:

// - Utiliza el hook `useState` para gestionar el estado del usuario y posibles errores.
// - Utiliza Firebase Authentication para la gestión de inicio de sesión y escucha de cambios de estado.
// - Obtiene el rol del usuario desde la base de datos Firestore y lo almacena en el estado.
// - Redirige al usuario a las páginas de inicio correspondientes según su rol (administrador o mecánico).
// - Muestra mensajes de error en caso de credenciales incorrectas.
// - Utiliza estilos CSS para dar formato a la interfaz de inicio de sesión.

import './styles/login.css'
import React, { useState, useEffect } from "react";
import { db, auth } from '../firebase'
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
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
      unsubscribe(); // Ensure to unsubscribe when the component unmounts
    };
  }, []);

  async function getRol(uid) {
    const docuRef = doc(db, `users/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    return docuCifrada.data().rol;
  }

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((rol) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(userData);
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
    // Redirect user based on their role when user state changes
    if (user) {
      user.rol === 'administrador' ? navigate("/indexAdmin") : navigate("/indexMecanico");
    }
  }, [user, navigate]);

  return (
    <>
      <div className='body'>
        <div className="container-form login">
          <div className="informacion">
            <div className="info">
              <h2>Bienvenido</h2>
              <p>taller mecanico <br /> Hans Motors</p>
            </div>
          </div>
          <div className="form-informacion">
            <div className="form-info-childs">
              <h2>Iniciar sesion</h2>
              <form className="formulario" onSubmit={handleSumit}>
                <label className='label-login'>
                  <i className='bx bx-envelope' ></i>
                  <input 
                    type="email" 
                    placeholder="email"
                    id='email'
                  />
                </label>
                <label className='label-login'>
                  <i className='bx bx-lock-alt'></i>                        
                  <input
                    type="password" 
                    placeholder="contrasena"
                    id='password'
                  />
                </label>
                <input 
                  type="submit" 
                  value="Iniciar sesion"
                  className="btn-enviar"
                />
              </form>
              {error && <p style={{marginTop: 10, fontSize: 15}}>{error}</p>}
            </div>
          </div>
        </div>
      </div>  
    </>
  );
};

export default Login;