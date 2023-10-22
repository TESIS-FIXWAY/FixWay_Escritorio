import React, { useState } from 'react';
import { db, auth } from "../../firebase";
import {  
  doc,
  setDoc,
} from "firebase/firestore";
import Admin from "./admin";
import { createUserWithEmailAndPassword } from "firebase/auth";

// class validadorRUT {
//   constructor(rut) {
//     this.rut = rut;
//     this.dv = rut.substring(this.rut.length - 1);
//     this.rut = this.rut.substring(0, this.rut.length - 1).replace(/\D/g, "");
//     this.esValido = this.validar();
//   }
//   validar() {
//     let numerosArray = this.rut.split("").reverse();
//     let acumulador = 0;
//     let multiplicador = 2;

//     for (let numero of numerosArray) {
//       acumulador += parseInt(numero) * multiplicador;
//       multiplicador++;
//       if (multiplicador == 8) {
//         multiplicador = 2;
//       }
//     }

//     let dv = 11 - (acumulador % 11);

//     if (dv == 11) 
//       dv = '0';

//     if (dv == 10) 
//       dv = 'k';

//     return dv == this.dv.toLowerCase();
//   }
  
//   formateado() {
//     if (!this.esValido) return '';

//     return (this.rut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")) + "-" + this.dv;
//   }
// }

const AgregarUsuario = () => {

  const [isResgistrando, setIsRegistrando] = useState(false);

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
                  />
                </div>
                <div className="user-input-box">
                  <label>ROL</label>
                  <input
                    id="rol"
                    type="text"
                    name="rut"
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
              <div className="form-submit-btn">
                <input 
                  type="submit" 
                  value="Crear Usuario"
                  id="nav-footer-button-second"
                />
              </div>
            </form>
          </div>
        </div>
    </>
  );
};

export default AgregarUsuario;