import React from "react";

const ClienteVista = ({
  clientes,
  setClientes,
  setClienteNombre,
  setClienteApellido,
  setClienteRut,
  setClienteEmail,
  setClienteTelefono,
  toggleClienteVista,
  // seleccionarCliente
}) => {
  const agregarCliente = () => {
    // Lógica para agregar un cliente
    const nuevoCliente = {
      nombre: setClienteNombre,
      apellido: setClienteApellido,
      rut: setClienteRut,
      email: setClienteEmail,
      telefono: setClienteTelefono
    };

    // Asegúrate de validar los datos antes de agregar el cliente
    if (nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.rut) {
      // Actualizar el estado de clientes
      setClientes([...clientes, nuevoCliente]);

      // Limpiar los campos después de agregar el cliente
      setClienteNombre("");
      setClienteApellido("");
      setClienteRut("");
      setClienteEmail("");
      setClienteTelefono("");

      // Cerrar la vista del cliente
      toggleClienteVista();
    } else {
      alert("Por favor, complete al menos nombre, apellido y rut del cliente.");
    }
  };

  const seleccionarCliente = (cliente) => {
    // Lógica para seleccionar un cliente
    setClienteNombre(cliente.nombre);
    setClienteApellido(cliente.apellido);
    setClienteRut(cliente.rut);
    setClienteEmail(cliente.email);
    setClienteTelefono(cliente.telefono);

    console.log(cliente);

    // Cerrar la vista del cliente
    toggleClienteVista();
  };

  return (
    <div className="fondo_no">
      <div className="editar" style={{ width: '1100px' }}>
        <p className="p_editar">Clientes</p>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Rut</th>
                <th scope="col">Email</th>
                <th scope="col">Telefono</th>
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
                    <button onClick={() => seleccionarCliente(item)}>Seleccionar</button>
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