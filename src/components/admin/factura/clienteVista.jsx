import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const ClienteVista = ({
  clientes,
  setClientes,
  setClienteNombre,
  setClienteApellido,
  setClienteRut,
  setClienteEmail,
  setClienteTelefono,
  clientesFiltrados,
  toggleClienteVista,
  seleccionarCliente,
  eliminarCliente,
  filtrarCliente,
}) => {
  const navigate = useNavigate();
  const agregarCliente = () => {
    const nuevoCliente = {
      nombre: setClienteNombre,
      apellido: setClienteApellido,
      rut: setClienteRut,
      email: setClienteEmail,
      telefono: setClienteTelefono,
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

  const crearCliente = () => {
    navigate("/crearClienteFactura");
  };

  return (
    <div className="fondo_no">
      <div className="editar" style={{ width: "1000px" }}>
        <p className="p_editar">Lista de Clientes</p>
        <input
          type="text"
          placeholder="Buscar cliente..."
          onChange={filtrarCliente}
        />
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
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
              {clientesFiltrados.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.apellido}</td>
                  <td>{item.rut}</td>
                  <td>{item.email}</td>
                  <td>{item.telefono}</td>
                  <td>
                    <button onClick={() => seleccionarCliente(item)}>
                      <FontAwesomeIcon icon="fa-solid fa-check" />
                    </button>
                    <button onClick={() => handleEliminarCliente(item.id)}>
                      <FontAwesomeIcon icon="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <tfoot>
          <tr>
            <td colSpan="6">
              <button
                style={{ background: "#437FF3", marginTop: "10px" }}
                onClick={crearCliente}
              >
                Crear Cliente
              </button>
              <button
                style={{ background: "#1DC258" }}
                onClick={toggleClienteVista}
              >
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
