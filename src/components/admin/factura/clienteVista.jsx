import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";

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
      <div className="editar" style={{ width: "1550px" }}>
        <p className="p_editar">Lista de Clientes</p>
        <input
          type="text"
          placeholder="Buscar cliente..."
          onChange={filtrarCliente}
        />
        <TableContainer component={Paper} style={{ maxHeight: "800px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>RUT</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.apellido}</TableCell>
                  <TableCell>{item.rut}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.telefono}</TableCell>
                  <TableCell>
                    <Button onClick={() => seleccionarCliente(item)}>
                      <DoneIcon sx={{ color: "white" }} />
                    </Button>
                    <Button onClick={() => handleEliminarCliente(item.id)}>
                      <DeleteIcon sx={{ color: "white" }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Button onClick={crearCliente} variant="outlined">
            Crear Cliente
          </Button>
          <Button onClick={toggleClienteVista} variant="outlined">
            Ocultar listado de clientes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClienteVista;
