import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditarUsuarioModalFactura = ({ factura, onSave, onCancel, onInputChange }) => {
  return (
    <div className="editar-modal">
      <p>Editar factura</p>
      <label htmlFor="">Proveedor</label>
      <input
        type="text"
        value={factura.proveedor}
        onChange={(e) => onInputChange('proveedor', e.target.value)}
      />
      <label htmlFor="">Fecha</label>
      <input 
        type="date"
        value={factura.fecha}
        onChange={(e) => onInputChange('fecha', e.target.value)}
      />
      <label htmlFor="">Detalle</label>
      <input
        type="text"
        value={factura.detalle}
        onChange={(e) => onInputChange('detalle', e.target.value)}
      />
      <button onClick={onSave}>
        <FontAwesomeIcon icon="fa-solid fa-check" />
      </button>
      <button onClick={onCancel}>
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      </button>
    </div>
  );
}

export default EditarUsuarioModalFactura;
