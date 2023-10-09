import { UserAuth } from "../../context/AuthContext";
import React, { useState } from 'react';
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import Admin from "./admin";

const AgregarUsuario = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [state, setState] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
  });

  const {createUser} = UserAuth();

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  }

  const createUserFirebase = async () => {
    await addDoc(collection(db, "users"), state);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await createUser(email, password) 
      alert('Usuario agregado');
    } catch (e) {
      setError(e.mesaage);
      console.log(error);
    }
  }

  return (
    <>
      <Admin />
        <div >
          <div className="form-info-childs">
            <h2>Agregar Usuario</h2>
            <p>Ingrese los datos del usuario</p>
            <form onSubmit={handleSubmit} className="formulario">
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={(e) => handleChangeText('nombre', e.target.value)}
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  onChange={(e) => handleChangeText('apellido', e.target.value)}
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="telefono"
                  placeholder="Telefono"
                  onChange={(e) => handleChangeText('telefono', e.target.value)}
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Direccion"
                  onChange={(e) => handleChangeText('direccion', e.target.value)}
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="email"
                  placeholder="Correo"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                <i className='bx bx-lock-alt'></i>
                <input
                  type="text"
                  name="password"
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <input 
                type="submit" 
                value="Crear Usuario"
                id="nav-footer-button-second"
                onClick={createUserFirebase}
              />
            </form>
          </div>
        </div>
    </>
  );
};

export default AgregarUsuario;