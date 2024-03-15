import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateDoc, doc } from 'firebase/firestore';
import '../../styles/previsualizarUsuario.css';
import '../../styles/listarUsuario.css';

const PrevisualizarUsuario = ({ user, onSave, onCancel, onInputChange }) => {
  const [editing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleInputChange = (name, value) => {
    onInputChange(user.id, name, value);
  };

  const handleEdit = () => {
    toggleEdit();
  };

  return (
    <div className='fondo_no'>
      <div className='editar'>
        {editing ? (
          <>
            <p className='p_editar'>Editar Usuario</p>

            <p className='p_editar'>
              <label className='etiqueta_editar'>Rol</label>
              <select className='select_rol'
                value={user.rol}
                onChange={(e) => handleInputChange('rol', e.target.value)}>
                <option value="mecanico" className='p_editar'>Mecánico</option>
                <option value="administrador" className='p_editar'>Administrador</option>
              </select>
            </p>

            <p className='p_editar'>
              <label className='etiqueta_editar' >Nombre</label>
              <input
                type="text"
                value={user.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}/>
            </p>

            <p className='p_editar'>
              <label className='etiqueta_editar' >Apellido</label>
              <input
              type="text"
              value={user.apellido}
              onChange={(e) => handleInputChange('apellido', e.target.value)}/>
            </p>

            <p className='p_editar'>
              <label className='etiqueta_editar' >Teléfono</label>
              <input
              type="text"
              value={user.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}/>
            </p>

            <p className='p_editar'>
              <label className='etiqueta_editar' >Dirección</label>
              <input
              type="text"
              value={user.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}/>
            </p>

            <p className='p_editar'>
              <label className='etiqueta_editar' >Sueldo</label>
              <input
              type="text"
              value={user.salario}
              onChange={(e) => handleInputChange('salario', e.target.value)}/>
            </p>

            <p className='p_editar'>
              <label className='etiqueta_editar'>Fecha de Ingreso</label>
              <input 
              type="date"
              value={user.fechaIngreso}
              onChange={(e) => handleInputChange('fechaIngreso', e.target.value)} />
            </p>

            <button className='guardar' onClick={() => {
              onSave(user.id, {
                nombre: user.nombre,
                apellido: user.apellido,
                telefono: user.telefono,
                direccion: user.direccion,
                salario: user.salario,
                fechaIngreso: user.fechaIngreso
              });
              toggleEdit();
            }}>
              <FontAwesomeIcon icon="fa-solid fa-check" /> Guardar
            </button>
            <button className='cancelar' onClick={toggleEdit}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" /> Cancelar
            </button>
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
            <button className='' onClick={handleEdit}>
              <FontAwesomeIcon icon="fa-solid fa-user-pen" /> Editar
            </button>
            <button className='cancelar' onClick={onCancel}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" /> Cerrar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PrevisualizarUsuario;
