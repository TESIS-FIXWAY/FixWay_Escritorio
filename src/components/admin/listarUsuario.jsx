import './listarUsuario.css'
import React, { useState } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { collection, getDocs, onSnapshot, query, addDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

import { deleteDoc } from 'firebase/firestore';

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
  const navigate = useNavigate();

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

  const deleteUser = async (userId) => {
    console.log('Eliminando usuario con ID:', userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log('Usuario eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const filtrarUsuario = (e) => {
    const texto = e.target.value.toLowerCase();
    const usuariosFiltrados = users.filter((user) => {
      const nombre = user.nombre.toLowerCase();
      const apellido = user.apellido.toLowerCase();
      const rut = user.rut.toLowerCase();
      const telefono = user.telefono.toLowerCase();
      const direccion = user.direccion.toLowerCase();
      const rol = user.rol.toLowerCase();
      const salario = user.salario.toLowerCase();
      return (
        nombre.includes(texto) ||
        apellido.includes(texto) ||
        rut.includes(texto) ||
        telefono.includes(texto) ||
        direccion.includes(texto) ||
        rol.includes(texto) ||
        salario.includes(texto)
      );
    });
    setUsers(usuariosFiltrados);
    if (texto === '') {
      window.location.reload();
    }
    if (usuariosFiltrados.map((user) => user.nombre).length === 0 ) {
      return alert('No se encontraron usuarios con ese nombre');
    }
  }
  const agregarUsuario = () => {
    navigate('/agregarUsuario');
  }

  const editarUsuario = () => {
    navigate('/editarUsuario');
  }

  return (
    <>
      <Admin />


        <div className='tabla_listar'>
          <div className='table_header'>
            <p>listar usuarios</p>
            <div>
              <input type="text" placeholder='buscar usuario' onChange={filtrarUsuario} />
              <button className='boton-ingreso' onClick={agregarUsuario}> + ingresar nuevo usuario</button>
            </div>
          </div>

          <div className='table_section'> 
            <table>

              <thead>
                <tr>
                  <th scope="col">Rut</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Direccion</th>
                  <th scope="col">Telefono</th>
                  <th scope="col">Cargo de trabajo</th>
                  <th scope="col">Salario</th>
                  <th scope='col'>actualizar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.rut }</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.direccion}</td>
                    <td>{user.telefono}</td>
                    <td>{user.rol}</td>
                    <td>{user.salario}</td>
                    <td>
                      <button onClick={editarUsuario} ><FontAwesomeIcon icon="fa-solid fa-pen" /></button>
                      <button onClick={() => deleteUser(user.id)}><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  );
};

export default ListarUsuario;