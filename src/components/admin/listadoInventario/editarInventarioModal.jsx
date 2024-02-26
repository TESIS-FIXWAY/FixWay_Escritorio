export default function EditarInventarioModal({ inventario, onSave, onCancel, onInputChange }) {
  return (
    <div className="editar-modal">
      <p>Editar inventario</p>
      <label htmlFor="">Código Producto</label>
      <input
        type="text"
        value={inventario.codigoProducto}
        onChange={(e) => onInputChange('codigoProducto', e.target.value)}
      />
      <label htmlFor="">Nombre Producto</label>
      <input
        type="text"
        value={inventario.nombreProducto}
        onChange={(e) => onInputChange('nombreProducto', e.target.value)}
      />
      <label htmlFor="">Categoría</label>
      <input
        type="text"
        value={inventario.categoria}
        onChange={(e) => onInputChange('categoria', e.target.value)}
      />
      <label htmlFor="">Marca</label>
      <input
        type="text"
        value={inventario.marca}
        onChange={(e) => onInputChange('marca', e.target.value)}
      />
      <label htmlFor="">Cantidad</label>
      <input
        type="text"
        value={inventario.cantidad}
        onChange={(e) => onInputChange('cantidad', e.target.value)}
      />
      <label htmlFor="">Costo</label>
      <input
        type="text"
        value={inventario.costo}
        onChange={(e) => onInputChange('costo', e.target.value)}
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
