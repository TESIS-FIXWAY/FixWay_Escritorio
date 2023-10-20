import { UserAuth } from "../../context/AuthContext";
import React, { useState } from 'react';
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import Admin from "./admin";

class validadorRUT {
  constructor(rut) {
    this.rut = rut;
    this.dv = rut.substring(this.rut.length - 1);
    this.rut = this.rut.substring(0, this.rut.length - 1).replace(/\D/g, "");
    this.esValido = this.validar();
  }
  validar() {
    let numerosArray = this.rut.split("").reverse();
    let acumulador = 0;
    let multiplicador = 2;

    for (let numero of numerosArray) {
      acumulador += parseInt(numero) * multiplicador;
      multiplicador++;
      if (multiplicador == 8) {
        multiplicador = 2;
      }
    }

    let dv = 11 - (acumulador % 11);

    if (dv == 11) 
      dv = '0';

    if (dv == 10) 
      dv = 'k';

    return dv == this.dv.toLowerCase();
  }
  
  formateado() {
    if (!this.esValido) return '';

    return (this.rut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")) + "-" + this.dv;
  }
}

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
    alert('Usuario Agregado');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await createUser(email, password) 
      alert('Usuario Agregado');
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
                  name="rut"
                  placeholder="Rut (11.111.111-1)"
                  onChange={(e) => handleChangeText('rut', e.target.value)}
                  onBlur={(e) => {new validadorRUT(e.target.value)}}
                  required
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  onChange={(e) => handleChangeText('nombre', e.target.value)}
                  required
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  onChange={(e) => handleChangeText('apellido', e.target.value)}
                  required
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="telefono"
                  placeholder="Telefono"
                  onChange={(e) => handleChangeText('telefono', e.target.value)}
                  required
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Direccion"
                  onChange={(e) => handleChangeText('direccion', e.target.value)}
                  required
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="email"
                  placeholder="Correo"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                <i className='bx bx-lock-alt'></i>
                <input
                  type="text"
                  name="password"
                  placeholder="Contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <label>
                <i className='bx bx-envelope' ></i>
                <input
                  type="text"
                  name="rol"
                  placeholder="Rol"
                  onChange={(e) => handleChangeText('rol', e.target.value)}
                  required
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