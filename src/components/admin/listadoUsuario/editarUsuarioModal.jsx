export default function EditarUsuarioModal({ user, onSave, onCancel, onInputChange }) {
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
}
