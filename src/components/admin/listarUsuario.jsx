import '../styles/listarUsuario.css'
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
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const formatSalario = (value) => {
    // Formatea el salario con separador de miles
    return parseInt(value, 10).toLocaleString('es-CL');
  };

  const EditarUsuarioModal = ({ user, onSave, onCancel, onInputChange }) => {
    return (
      <div className="editar-modal">
        <p>Editar usuario</p>
        <label htmlFor="">Rol</label>
        <input
          type="text"
          value={user.rol}
          onChange={(e) => onInputChange('rol', e.target.value)}
        />
        <button onClick={onSave}>
          <FontAwesomeIcon icon="fa-solid fa-check" />
        </button>
        <button onClick={onCancel}>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      </div>
    );
  };

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'users')), (querySnapshot) => {
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const startDelete = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
    setIsDeleteModalOpen(false);
  }

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
    setIsEditingModalOpen(true);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setIsEditingModalOpen(false);
  };

  const saveEdit = async (userId, updatedData) => {
    try {
      await updateDoc(doc(db, 'users', userId), updatedData);
      setEditingUserId(null);
      setIsEditingModalOpen(false); 
      console.log('Usuario actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };





  const handleInputChange = (userId, name, value) => {
    let updatedValue = value;

    // Formatea el salario al escribir
    if (name === 'salario') {
      // Solo mantiene los dígitos y el separador de miles al formatear
      updatedValue = value.replace(/[^\d]/g, '');
    }

    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, [name]: updatedValue } : user
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
                  <th scope="col">Correo Electrónico</th> {/* Nueva columna para el correo electrónico */}
                  <th scope="col">Cargo <br /> de trabajo</th>
                  <th scope="col">Salario</th>
                  <th scope='col'>Actualizar</th>
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
                    <td>{user.email}</td> {/* Asegúrate de que "email" sea el campo correcto */}
                    <td>{user.rol}</td>
                    <td>{formatSalario(user.salario)}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <>
                          <div className='fondo_no'>
                            <div className='editar'>
                              <p className='p_editar'>editar usuarios</p>


                              <p className='p_editar'>
                                <label className='etiqueta_editar'>Rol</label>
                                <select className='select_rol'
                                  value={user.rol}
                                  onChange={(e) => handleInputChange(user.id, 'rol', e.target.value)}>
                                  <option value="mecanico" className='p_editar'>Mecánico</option>
                                  <option value="administrador" className='p_editar'>Administrador</option>
                                </select>
                              </p>

                              <p className='p_editar'>
                                <label className='etiqueta_editar' >nombre</label>
                                <input
                                type="text"
                                value={user.nombre}
                                onChange={(e) => handleInputChange(user.id, 'nombre', e.target.value)}/>
                              </p>
                              <p className='p_editar'>
                                <label className='etiqueta_editar' >apellido</label>
                                <input
                                type="text"
                                value={user.apellido}
                                onChange={(e) => handleInputChange(user.id, 'apellido', e.target.value)}/>
                              </p>
                              <p className='p_editar'>
                                <label className='etiqueta_editar' >telefono</label>
                                <input
                                type="text"
                                value={user.telefono}
                                onChange={(e) => handleInputChange(user.id, 'telefono', e.target.value)}/>
                              </p>
                              <p className='p_editar'>
                                <label className='etiqueta_editar' >direccion</label>
                                <input
                                type="text"
                                value={user.direccion}
                                onChange={(e) => handleInputChange(user.id, 'direccion', e.target.value)}/>
                              </p>
                              <p className='p_editar'>
                                <label className='etiqueta_editar' >salario</label>
                                <input
                                type="text"
                                value={user.salario}
                                onChange={(e) => handleInputChange(user.id, 'salario', e.target.value)}/>
                              </p>
                              <p className='p_editar'>
                                <label className='etiqueta_editar' >contraseña</label>
                                <input
                                type="text"
                                value={user.password}
                                onChange={(e) => handleInputChange(user.id, 'password', e.target.value)}/>
                              </p>
                              <button className='guardar' onClick={() => saveEdit(user.id, user)}><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                              <button className='cancelar' onClick={() => cancelEditing()}><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <button onClick={() => startEditing(user.id)}><FontAwesomeIcon icon="fa-solid fa-user-pen" /></button>
                      )}
                      {deleteUserId === user.id ? (
                        <>
                        <div className='fondo_no'>
                          <div className='editar'>
                          <p className='p_editar'>¿Estás seguro que deseas <br /> eliminar este usuario?</p>
                          <button className='guardar' onClick={() => deleteUser(user.id)}><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                          <button className='cancelar' onClick={() => cancelDelete()}><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                          </div>
                        </div>
                        </>
                      ): (
                        <button onClick={() => startDelete(user.id)}><FontAwesomeIcon icon={faTrash}/></button>
                      )}
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