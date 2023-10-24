import './agregarUsario.css'
import React from 'react';
import { db, auth } from "../../firebase";
import {  
  doc,
  setDoc,
} from "firebase/firestore";
import Admin from "./admin";
import { createUserWithEmailAndPassword } from "firebase/auth";
import validadorRUT from './validadorRUT';


const AgregarUsuario = () => {
  async function registrarUsuario(rut, rol, nombre, apellido, telefono, direccion, email, password, salario) {
    const infoUsuario = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((usuarioFirebase) => {
      return usuarioFirebase;
    })

    console.log(infoUsuario.user.uid);
    const docuRef = doc(db, `users/${infoUsuario.user.uid}`);
    setDoc(docuRef, {
      rut: rut,
      rol: rol,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      direccion: direccion,
      email: email,
      password: password,
      salario: salario
    });
  }

  function submitHandler (e) {
    e.preventDefault();
    const rut = e.target.elements.rut.value;
    const rol = e.target.elements.rol.value;
    const nombre = e.target.elements.nombre.value;
    const apellido = e.target.elements.apellido.value;
    const telefono = e.target.elements.telefono.value;
    const direccion = e.target.elements.direccion.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const salario = e.target.elements.salario.value;

    console.log(rut, rol, nombre, apellido, telefono, direccion, email, password, salario);
    registrarUsuario(rut, rol, nombre, apellido, telefono, direccion, email, password, salario);
  }

  function validarRut() {
    const rut = document.getElementById("rut").value;
    const validador = new validadorRUT(rut);
    if (validador.esValido) {
      document.getElementById("rut").value = validador.formateado();
      console.log("Rut valido");
      alert("Rut valido");
    } else {
      alert("Rut invalido");
      console.log("Rut invalido");
    }
  }

  return (
    <>
      <Admin />
        <div >
          <div className="contenedor">
            <h1 className="form-title">Agregar Usuario</h1>
            <form className=" " onSubmit={submitHandler}>
              <div className="main-user-info">
                <div className="user-input-box">
                  <label>Rut</label>
                  <input
                    id="rut"
                    type="text"
                    name="rut"
                    placeholder="Rut (11.111.111-1)"
                    required
                    onBlur={validarRut}
                  />
                </div>
                <div className="user-input-box">
                  <label>ROL</label>
                  <input
                    id="rol"
                    type="text"
                    name="rol"
                    placeholder="ROL"
                    required
                  />
                </div>
                <div className="user-input-box">
                  <label>nombre</label>
                  <input
                    id="nombre"
                    required
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    />
                  </div>
                  <div className="user-input-box">
                    <label>apellido</label>
                    <input
                      id="apellido"
                      required
                      type="text"
                      name="apellido"
                      placeholder="Apellido"
                      />
                  </div>
                  <div className="user-input-box">
                    <label>telefono</label>
                    <input
                      id="telefono"
                      required
                      type="text"
                      name="telefono"
                      placeholder="Telefono"
                    />
                  </div>
                  <div className="user-input-box">
                    <label>direccion</label>
                    <input
                      id="direccion"
                      required
                      type="text"
                      name="direccion"
                      placeholder="Direccion"
                    />
                  </div>
                  <div className="user-input-box">
                    <label>email</label>
                    <input
                      id="email"
                      required
                      type="text"
                      name="email"
                      placeholder="Correo"
                    />
                  </div>
                  <div className="user-input-box">
                    <label>Contraseña</label>
                    <input
                      id="password"
                      required
                      type="text"
                      name="password"
                      placeholder="Contraseña"
                    />
                  </div>
                  <div className="user-input-box">
                    <label>Salario</label>
                    <input
                      id="salario"
                      required
                      type="text"
                      name="salario"
                      placeholder="Salario"
                    />
                  </div>
              </div>
              <div className="button">
                <button type="submit">Agregar</button>
              </div>
            </form>
          </div>
        </div>    
    </>
  );
};

export default AgregarUsuario;