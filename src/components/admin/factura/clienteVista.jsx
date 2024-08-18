import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../../context/darkMode";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import "../../styles/ClienteVista.css";

const ClienteVista = ({
  clientesFiltrados,
  toggleClienteVista,
  seleccionarCliente,
  eliminarCliente,
  filtrarCliente,
}) => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEliminarCliente = (clienteId) => {
    eliminarCliente(clienteId);
  };

  const crearCliente = () => {
    navigate("/crearClienteFactura");
  };

  return (
    <div className={`fondo_no ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`editar ${isDarkMode ? "dark-mode" : ""}`}>
        <p className="p_editar">Lista de Clientes</p>
        <TextField
          type="text"
          placeholder="Buscar cliente..."
          onChange={filtrarCliente}
          variant="outlined"
          label="Buscar cliente.."
          sx={{
            marginTop: "12px",
            padding: "8px",
          }}
        />
        <TableContainer
          component={Paper}
          style={{ maxHeight: "800px", marginTop: "12px" }}
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
              {(rowsPerPage > 0
                ? clientesFiltrados.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : clientesFiltrados
              ).map((item, index) => (
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
        <TablePagination
          rowsPerPageOptions={[4, 8, 12]}
          component="div"
          count={clientesFiltrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          className={isDarkMode ? "dark-mode" : ""}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Button
            onClick={crearCliente}
            variant="contained"
            color="success"
            className={isDarkMode ? "dark-mode" : ""}
          >
            Crear Cliente
          </Button>
          <Button
            onClick={toggleClienteVista}
            variant="contained"
            color="inherit"
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
