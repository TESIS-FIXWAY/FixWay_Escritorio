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
        <div className='contenedor_registro'>
          <h1 className='logo_registro'>agregar nuevo Usario</h1>
          <div className='registro_wrapper'>
            <div className='nuevo_registro'>
              <h3>por favor rellene todos los campos</h3>
              <form action="" onSubmit={submitHandler}>
                <p className='p_registro'>
                  <label className='label_registro'>Rut</label>
                  <input id="rut" type="text"
                    name="rut" placeholder="Rut (11.111.111-1)" required
                    onChange={(e) => {new validadorRUT(e.target.value)}}/>
                </p>
                <p className='p_registro'>
                  <label className='label_registro'>nombre</label>
                  <input id="nombre" required type="text"
                    name="nombre"placeholder="Nombre"/>
                </p>

                <p className='p_registro'>
                  <label className='label_registro'>apellido</label>
                    <input id="apellido" required
                      type="text" name="apellido" placeholder="Apellido"/>
                </p>
                <p className='p_registro'>
                  <label className='label_registro'>telefono</label>
                  <input id="telefono" required
                    type="text" name="telefono" placeholder="Telefono"/>
                </p>

                <p className='p_registro'>
                  <label className='label_registro'>direccion</label>
                  <input id="direccion" required
                    type="text" name="direccion" placeholder="Direccion"/>
                </p>

                <p className='p_registro'>
                  <label className='label_registro'>Email</label>
                  <input id="email" required
                    type="text" name="email" placeholder="Correo"/>
                </p>

                <p className='p_registro'>
                  <label className='label_registro'>Contraseña</label>
                  <input id="password" required type="text"
                    name="password" placeholder="Contraseña"/>
                </p>

                <p className='p_registro'>
                  <label className='label_registro'>Salario</label>
                  <input id="salario" required
                    type="text" name="salario" placeholder="Salario"/>
                </p>
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
        </div>            
    </>
  );
};

export default AgregarUsuario;