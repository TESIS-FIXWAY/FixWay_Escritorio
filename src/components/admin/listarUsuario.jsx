import './listarUsuario.css'
import React, { useState } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { collection, getDocs, onSnapshot, query, addDoc, doc } from "firebase/firestore";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faPen, faTrash
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faPen,
  faTrash
);

const ListarUsuario = () => {

  const [users, setUsers] = useState([]);

  React.useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          rut: doc.data().rut,
          rol: doc.data().rol,
          salario: doc.data().salario,
          nombre: doc.data().nombre,
          apellido: doc.data().apellido,
          direccion: doc.data().direccion,
          telefono: doc.data().telefono,
        });
      });
      setUsers(users);
    });
    return () => unsubscribe();
  }, []);




  return (
    <>
      <Admin />


      <div className='table'>
        <div className='table_header'>
          <p>listar usuarios</p>
          <div>
            <input type="text" placeholder='buscar usuario' />
            <button className='boton-ingreso'>+ ingresar nuevo usuario</button>
          </div>
        </div>

        <div className='table_section'> 
          <table>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Direccion</th>
                <th scope="col">Telefono</th>
                <th scope="col">Cargo de trabajo</th>
                <th scope="col">Salario</th>
                <th>
                  <button><FontAwesomeIcon icon="fa-solid fa-pen" /></button>
                  <button><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
                </th>
              </tr>
            </thead>
          </table>
        </div>

      </div>



      <div className="contenedor-tabla">
        <table className="tabla">

          <caption>Listado de Usuarios</caption>
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Direccion</th>
              <th scope="col">Telefono</th>
              <th scope="col">Cargo de trabajo</th>
              <th scope="col">Salario</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.direccion}</td>
                <td>{user.telefono}</td>
                <td>{user.rol}</td>
                <td>{user.salario}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>


    </>
  );
};

export default ListarUsuario;