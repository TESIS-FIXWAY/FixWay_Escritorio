import '../../styles/listarUsuario.css'
import React, { useState } from "react";
import Admin from "../admin";
import { db } from "../../../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import EditarUsuarioModal from './editarUsuarioModal';
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
import PrevisualizarUsuario from './previsualizarUsuario';

const ListarUsuario = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const formatSalario = (value) => {
    return parseInt(value, 10).toLocaleString('es-CL');
  };

  const editarUsuarioModal = ({ user, onSave, onCancel, onInputChange }) => {
    <EditarUsuarioModal 
      user={user}
      onSave={onSave}
      onCancel={onCancel}
      onInputChange={onInputChange}
    />
  };

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'users')), (querySnapshot) => {
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, [refresh]);

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

    if (name === 'salario') {
      updatedValue = value.replace(/[^\d]/g, '');
    }

    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, [name]: updatedValue } : user
    );
    setUsers(updatedUsers);
  };

  const filtrarUsuario = (e) => {
    const texto = e.target.value.toLowerCase();
    const filtro = users.filter((user) => {
      return (
        user.nombre.toLowerCase().includes(texto) ||
        user.apellido.toLowerCase().includes(texto) ||
        user.rut.toLowerCase().includes(texto) ||
        user.telefono.toLowerCase().includes(texto) ||
        user.direccion.toLowerCase().includes(texto) ||
        user.email.toLowerCase().includes(texto) ||
        user.rol.toLowerCase().includes(texto) ||
        user.salario.toLowerCase().includes(texto) ||
        user.fechaIngreso.toLowerCase().includes(texto)
      );
    });
    setUsers(filtro);

    if(texto === '') {
      setRefresh((prevRefresh) => !prevRefresh);
    }
  };

  const agregarUsuario = () => {
    navigate('/agregarUsuario');
  }

  return (
    <>
      <Admin />
        <div className='tabla_listar'>
          <div className='table_header'>
            <h1>Listar Usuarios</h1>
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
                  <th scope="col">RUT</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Teléfono</th>
                  <th scope="col">Correo <br /> Electrónico</th> 
                  <th scope="col">Cargo <br /> de trabajo</th>
                  <th scope='col'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.rut}</td>
                    <td>{user.nombre} {user.apellido}</td>
                    <td>{user.telefono}</td>
                    <td>{user.email}</td> 
                    <td>{user.rol}</td>
                    <td>
                      {editingUserId === user.id ? (
                        <PrevisualizarUsuario
                          user={user}
                          onSave={(updatedData) => saveEdit(user.id, updatedData)}
                          onCancel={() => cancelEditing()}
                          onInp utChange={(name, value) => handleInputChange(user.id, name, value)}
                        />
                      ) : (
                        <>
                          <button onClick={() => startEditing(user.id)}><FontAwesomeIcon icon={faUserPen} /> Editar Usuario</button>
                        </>
                      )}
                      {deleteUserId === user.id ? (
                        <>
                          <div className='fondo_no'>
                            <div className='editar'>
                              <p className='p_editar'>¿Estás seguro de que deseas <br /> eliminar este usuario?</p>
                              <button className='guardar' onClick={() => deleteUser(user.id)}><FontAwesomeIcon icon={faCheck} /></button>
                              <button className='cancelar' onClick={() => cancelDelete()}><FontAwesomeIcon icon={faXmark} /></button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <button onClick={() => startDelete(user.id)}><FontAwesomeIcon icon={faTrash} /></button>
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