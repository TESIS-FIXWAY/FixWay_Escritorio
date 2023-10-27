import './listarUsuario.css'
import React, { useState } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUserPen, 
  faTrash, 
  faMagnifyingGlass, 
  faCheck, 
  faXmark
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faUserPen,
  faTrash,
  faMagnifyingGlass,
  faCheck,
  faXmark
);

const ListarUsuario = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'users')), (querySnapshot) => {
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log('Usuario eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const startEditing = (userId) => {
    setEditingUserId(userId);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
  };

  const saveEdit = async (userId, updatedData) => {
    try {
      await updateDoc(doc(db, 'users', userId), updatedData);
      setEditingUserId(null);
      console.log('Usuario actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  const handleInputChange = (userId, name, value) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, [name]: value } : user
    );
    setUsers(updatedUsers);
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

  return (
    <>
      <Admin />
        <div className='tabla_listar'>
          <div className='table_header'>
            <p>listar usuarios</p>
            <div>
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
              <input type="text" placeholder='buscar usuario' onChange={filtrarUsuario} />
              <button className='boton-ingreso' onClick={agregarUsuario}> <FontAwesomeIcon icon="fa-solid fa-user-plus" /> ingresar nuevo usuario</button>
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
                    {/* Tu código existente para los datos de la tabla */}
                    <td>{user.rut }</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.direccion}</td>
                    <td>{user.telefono}</td>
                    <td>{user.rol}</td>
                    <td>{user.salario}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <>
                          <input
                            type="text"
                            value={user.rol}
                            onChange={(e) => handleInputChange(user.id, 'rol', e.target.value)}/>
                          <input
                            type="text"
                            value={user.nombre}
                            onChange={(e) => handleInputChange(user.id, 'nombre', e.target.value)}/>
                          <input
                            type="text"
                            value={user.apellido}
                            onChange={(e) => handleInputChange(user.id, 'apellido', e.target.value)}/>
                          <input
                            type="text"
                            value={user.telefono}
                            onChange={(e) => handleInputChange(user.id, 'telefono', e.target.value)}/>
                          <input
                            type="text"
                            value={user.direccion}
                            onChange={(e) => handleInputChange(user.id, 'direccion', e.target.value)}/>
                          <input
                            type="text"
                            value={user.salario}
                            onChange={(e) => handleInputChange(user.id, 'salario', e.target.value)}/>
                          <input
                            type="text"
                            value={user.password}
                            onChange={(e) => handleInputChange(user.id, 'password', e.target.value)}/>
                          <button onClick={() => saveEdit(user.id, user)}><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                          <button onClick={() => cancelEditing()}><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                        </>
                      
                      
                      ) : (
                        <button onClick={() => startEditing(user.id)}><FontAwesomeIcon icon="fa-solid fa-user-pen" /></button>
                      
                      )}
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