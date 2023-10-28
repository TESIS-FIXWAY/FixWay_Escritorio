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
      <Admin/>
      <div className='body_formulario'>
        <div className='formulario_content'>
          <div className='formulario_wrapper'>
            <div className='formulario_contact'>
              <h1 className='formulario_titulo'>Agregar Usuario</h1>
              <form className="formulario_form"onSubmit={submitHandler}>
                <p>
                  <label className='label_formulario'>Rut</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="rut"
                    type="text"
                    name="rut"
                    placeholder="Rut (11.111.111-1)"
                    required
                    onBlur={validarRut}/>
                </p>
                <p>
                  <label className='label_formulario'>ROL</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="rol"
                    type="text"
                    name="rol"
                    placeholder="ROL"
                    required/>
                </p>
                <p>
                  <label className='label_formulario'>Nombre</label>                  
                  <br />
                  <input
                    className='input_formulario'
                    id="nombre"
                    required
                    type="text"
                    name="nombre"
                    placeholder="Nombre"/>
                </p>
                <p>
                  <label className='label_formulario'>Apellido</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="apellido"
                    required
                    type="text"
                    name="apellido"
                    placeholder="Apellido"/>
                </p>
                <p>
                  <label className='label_formulario'>Telefono</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="telefono"
                    required
                    type="tel"
                    name="telefono"
                    pattern="[+]56 [0-9]{1} [0-9]{8}"
                    placeholder="Ejemplo: +56 9 12345678"/>
                </p>
                <p>
                  <label className='label_formulario'>Direccion</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="direccion"
                    required
                    type="text"
                    name="direccion"
                    placeholder="Direccion"/>
                </p>
                <p>
                  <label className='label_formulario'>Salario</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="salario"
                    required
                    type="number"
                    name="salario"
                    placeholder="Salario"/>
                </p>
                <p>
                  <label className='label_formulario'>Contraseña</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="password"
                    required
                    type="text"
                    name="password"
                    placeholder="Contraseña"/>
                </p>
                <p>
                  <label className='label_formulario'>Email</label>
                  <br />
                  <input
                    className='input_formulario'
                    id="email"
                    required
                    type="text"
                    name="email"
                    placeholder="Correo"/>
                </p>
                <p className='block_boton'>
                  <button type="submit" onClick={AgregarUsuario} className='boton_formulario'>
                    Agregar
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgregarUsuario;