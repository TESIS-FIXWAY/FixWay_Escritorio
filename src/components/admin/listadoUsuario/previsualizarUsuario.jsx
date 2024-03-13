import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/previsualizarUsuario.css';

const PrevisualizarUsuario = ({ user, onSave, onCancel, onInputChange }) => {
  const [editing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <div className='fondo_no'>
      <div className='editar'>
        {editing ? (
          <>
            <p className='p_editar'>Editar Usuario</p>
            {editingUserId === user.id ? (
              <>
                <div className='fondo_no'>
                  <div className='editar'>
                    <p className='p_editar'>Editar Usuarios</p>
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
                      <label className='etiqueta_editar' >Nombre</label>
                      <input
                      type="text"
                      value={user.nombre}
                      onChange={(e) => handleInputChange(user.id, 'nombre', e.target.value)}/>
                    </p>
                    <p className='p_editar'>
                      <label className='etiqueta_editar' >Apellido</label>
                      <input
                      type="text"
                      value={user.apellido}
                      onChange={(e) => handleInputChange(user.id, 'apellido', e.target.value)}/>
                    </p>
                    <p className='p_editar'>
                      <label className='etiqueta_editar' >Teléfono</label>
                      <input
                      type="text"
                      value={user.telefono}
                      onChange={(e) => handleInputChange(user.id, 'telefono', e.target.value)}/>
                    </p>
                    <p className='p_editar'>
                      <label className='etiqueta_editar' >Dirección</label>
                      <input
                      type="text"
                      value={user.direccion}
                      onChange={(e) => handleInputChange(user.id, 'direccion', e.target.value)}/>
                    </p>
                    <p className='p_editar'>
                      <label className='etiqueta_editar' >Sueldo</label>
                      <input
                      type="text"
                      value={user.salario}
                      onChange={(e) => handleInputChange(user.id, 'salario', e.target.value)}/>
                    </p>
                    <p className='p_editar'>
                      <label className='etiqueta_editar'>Fecha de Ingreso</label>
                      <input 
                      type="date"
                      value={user.fechaIngreso}
                      onChange={(e) => handleInputChange(user.id, 'fechaIngreso', e.target.value)} />
                    </p>
                    <button className='guardar' onClick={() => saveEdit(user.id, user)}><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                    <button className='cancelar' onClick={() => cancelEditing()}><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                  </div>
                </div>
              </>
            ) : (
              <button onClick={() => startEditing(user.id)}><FontAwesomeIcon icon="fa-solid fa-user-pen" /></button>
            )}
            <button className='guardar' onClick={onSave}><FontAwesomeIcon icon="fa-solid fa-check" /> Guardar</button>
            <button className='cancelar' onClick={() => { toggleEdit(); onCancel(); }}><FontAwesomeIcon icon="fa-solid fa-xmark" /> Cancelar</button>
          </>
        ) : (
          <>
            <p className='p_editar'>Previsualización de Usuario</p>
            <p className='p_editar'><strong>Rol:</strong> {user.rol}</p>
            <p className='p_editar'><strong>Nombre:</strong> {user.nombre} {user.apellido}</p>
            <p className='p_editar'><strong>Teléfono:</strong> {user.telefono}</p>
            <p className='p_editar'><strong>Correo Electrónico:</strong> {user.email}</p>
            <p className='p_editar'><strong>Dirección:</strong> {user.direccion}</p>
            <p className='p_editar'><strong>Sueldo:</strong> {user.salario}</p>
            <p className='p_editar'><strong>Fecha de Ingreso:</strong> {user.fechaIngreso}</p>
            <button className='editar' onClick={toggleEdit}><FontAwesomeIcon icon="fa-solid fa-user-pen" /> Editar</button>
            <button className='cancelar' onClick={onCancel}><FontAwesomeIcon icon="fa-solid fa-xmark" /> Cerrar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PrevisualizarUsuario;
