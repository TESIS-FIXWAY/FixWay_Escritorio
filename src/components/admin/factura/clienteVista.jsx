import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../../context/darkMode";
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
import "../../styles/ClienteVista.css";

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

  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <div className={`fondo_no ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`editar ${isDarkMode ? "dark-mode" : ""}`}>
        <p className="p_editar">Lista de Clientes</p>
        <input
          type="text"
          placeholder="Buscar cliente..."
          onChange={filtrarCliente}
        />
        <TableContainer
          component={Paper}
          style={{ maxHeight: "800px" }}
          className={isDarkMode ? "dark-mode" : ""}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={isDarkMode ? "dark-mode" : ""}>
                  Nombre
                </TableCell>
                <TableCell className={isDarkMode ? "dark-mode" : ""}>
                  RUT
                </TableCell>
                <TableCell className={isDarkMode ? "dark-mode" : ""}>
                  Email
                </TableCell>
                <TableCell className={isDarkMode ? "dark-mode" : ""}>
                  Teléfono
                </TableCell>
                <TableCell className={isDarkMode ? "dark-mode" : ""}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientesFiltrados.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    {item.nombre} {item.apellido}
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    {item.rut}
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    {item.email}
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    {item.telefono}
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    <Button onClick={() => seleccionarCliente(item)}>
                      <DoneIcon
                        sx={{ color: isDarkMode ? "white" : "black" }}
                      />
                    </Button>
                    <Button onClick={() => handleEliminarCliente(item.id)}>
                      <DeleteIcon
                        sx={{ color: isDarkMode ? "white" : "black" }}
                      />
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
          <Button
            onClick={crearCliente}
            variant="outlined"
            className={isDarkMode ? "dark-mode" : ""}
          >
            Crear Cliente
          </Button>
          <Button
            onClick={toggleClienteVista}
            variant="outlined"
            className={isDarkMode ? "dark-mode" : ""}
          >
            Ocultar listado de clientes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClienteVista;
