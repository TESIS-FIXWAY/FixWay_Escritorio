import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ClienteVista = ({
  clientes,
  setClientes,
  setClienteNombre,
  setClienteApellido,
  setClienteRut,
  setClienteEmail,
  setClienteTelefono,
  toggleClienteVista,
  seleccionarCliente,
  eliminarCliente,
  filtrarCliente
}) => {
  const agregarCliente = () => {
    const nuevoCliente = {
      nombre: setClienteNombre,
      apellido: setClienteApellido,
      rut: setClienteRut,
      email: setClienteEmail,
      telefono: setClienteTelefono
    };

    if (nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.rut) {
      setClientes([...clientes, nuevoCliente]);

      setClienteNombre("");
      setClienteApellido("");
      setClienteRut("");
      setClienteEmail("");
      setClienteTelefono("");

      toggleClienteVista();
    } else {
      alert("Por favor, complete al menos nombre, apellido y rut del cliente.");
    }
  }; 

  const handleEliminarCliente = (clienteId) => {
    eliminarCliente(clienteId); 
  };

  return (
    <div className="fondo_no">
      <div className="editar" style={{ width: '1100px' }}>
        <p className="p_editar">Lista Clientes</p>
        <input
          type="text"
          placeholder="Buscar cliente..."
          onChange={filtrarCliente}
        />
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">RUT</th>
                <th scope="col">Email</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.apellido}</td>
                  <td>{item.rut}</td>
                  <td>{item.email}</td>
                  <td>{item.telefono}</td>
                  <td>
                    <button onClick={() => seleccionarCliente(item)}><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                    <button onClick={() => handleEliminarCliente(item.id)}><FontAwesomeIcon icon="fa-solid fa-trash" /></button> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <tfoot>
          <tr>
            <td colSpan="6">
              <button style={{ background: '#1DC258' }} onClick={toggleClienteVista}>
                Ocultar listado de clientes
              </button>
            </td>
          </tr>
        </tfoot>
      </div>
    </div>
  );
};

export default ClienteVista;
