import '../../src/styles/Globals.css'
import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Login = () => {
  const [user, setUser] = useState(null);

  async function getRol(uid) {
    const docuRef = doc(firestore, `users/${uid}`);
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
      console.log("userData fianl", userData);
    });
  }

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      //funcion final

      if (!user) {
        setUserWithFirebaseAndRol(usuarioFirebase);
      }
    } else {
      setUser(null);
    }
  });

  return (
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
                <form className="formulario" onSubmit={handleSumit}>
                    <label>
                        <i className='bx bx-envelope' ></i>
                        <input 
                          type="email" 
                          placeholder="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)} 
                        />
                    </label>
                    <label>
                        <i className='bx bx-lock-alt'></i>                        
                        <input
                          type="password" 
                          placeholder="contrasena"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <input 
                      type="submit" 
                      value="Iniciar sesion"
                    />
                </form>
            </div>
        </div>
    </div>
  );
};

export default Login;