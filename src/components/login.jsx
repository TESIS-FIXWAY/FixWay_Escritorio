import './login.css'
import React, { useState } from "react";
import { db, auth } from '../firebase'
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged,signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function getRol(uid) {
    const docuRef = doc(db, `users/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data().rol;
    return infoFinal;
  }

  function setUserWithFirebaseAndRol(usuarioFirebase) {
    getRol(usuarioFirebase.uid).then((rol) => {
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(userData);
      console.log("userData final", userData);
    });
  }

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      if (!user) {
        setUserWithFirebaseAndRol(usuarioFirebase);
      }
    } else {
      setUser(null);
    }
  });

  function handleSumit (e) {
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password);
    user.rol === 'administrador' ? navigate("/admin") : navigate("/mecanico");
  }

  return (
    <>
    <div className='body'>

      <div className="container-form login">
        <div className="informacion">
            <div className="info">
                  <h2>Bienvenido</h2>
                  <p>taller mecanico Hans Motors</p>
              </div>
          </div>
          <div className="form-informacion">
              <div className="form-info-childs">
                  <h2>Iniciar sesion</h2>
                  <form className="formulario" onSubmit={handleSumit} >
                      <label className='label_login'>
                          <i className='bx bx-envelope' ></i>
                          <input 
                            type="email" 
                            placeholder="email"
                            id='email'
                          />
                      </label>
                      <label className='label_login'>
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
              </div>
          </div>
        </div>

    </div>


      
    </>
  );
};

export default Login;