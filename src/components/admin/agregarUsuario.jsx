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
    rut: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    rol:''
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

  const rutVerifier = (rut) => {
    var valor = rut.replace('.', '');
    valor = valor.replace('-', '');
    cuerpo = valor.slice(0, -1);
    dv = valor.slice(-1).toUpperCase();
    rut.value = cuerpo + '-' + dv
    if (cuerpo.length < 7) { rut.setCustomValidity("RUT Incompleto"); return false; }
    suma = 0;
    multiplo = 2;
    for (i = 1; i <= cuerpo.length; i++) {
      index = multiplo * valor.charAt(cuerpo.length - i);
      suma = suma + index;
      if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
    }
    dvEsperado = 11 - (suma % 11);
    dv = (dv == 'K') ? 10 : dv;
    dv = (dv == 0) ? 11 : dv;
    if (dvEsperado != dv) { rut.setCustomValidity("RUT Inválido"); return false; }
    rut.setCustomValidity('');
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
                  name="rut"
                  placeholder="Rut"
                  onChange={(e) => handleChangeText('rut', e.target.value)}
                  onBlur={(e) => rutVerifier()}
                />
              </label>
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
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="rol"
                  placeholder="Rol"
                  onChange={(e) => handleChangeText('rol', e.target.value)}
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