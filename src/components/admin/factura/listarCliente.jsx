import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../../context/darkMode";
import { Typography } from "@mui/material";
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
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "../../styles/ClienteVista.css";
import Admin from "../admin";

const ListarCliente = () => {
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrado, setClientesFiltrado] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedClientData, setSelectedClientData] = useState({});
    const navigate = useNavigate();
    const { isDarkMode } = useContext(DarkModeContext);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "clientes"),
            (querySnapshot) => {
                const clientesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setClientes(clientesData);
                setClientesFiltrado(clientesData);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setClientesFiltrado(
            clientes.filter(cliente =>
                cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cliente.telefono.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, clientes]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClickOpenDelete = (id) => {
        setSelectedClientId(id);
        setOpenDeleteDialog(true);
    };

    const handleClickOpenEdit = (clientData) => {
        setSelectedClientData(clientData);
        setOpenEditDialog(true);
    };

    const handleCloseDelete = () => {
        setOpenDeleteDialog(false);
        setSelectedClientId(null);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setSelectedClientData({});
    };

    const handleDelete = async () => {
        try {
            if (selectedClientId) {
                await deleteDoc(doc(db, "clientes", selectedClientId));
                setClientes(clientes.filter(cliente => cliente.id !== selectedClientId));
                setClientesFiltrado(clientesFiltrado.filter(cliente => cliente.id !== selectedClientId));
                handleCloseDelete();
            }
        } catch (error) {
            console.error("Error eliminando el cliente: ", error);
        }
    };

    const handleUpdate = async () => {
        try {
            const clientRef = doc(db, "clientes", selectedClientData.id);
            await updateDoc(clientRef, selectedClientData);
            setClientes(clientes.map(cliente => cliente.id === selectedClientData.id ? selectedClientData : cliente));
            setClientesFiltrado(clientesFiltrado.map(cliente => cliente.id === selectedClientData.id ? selectedClientData : cliente));
            handleCloseEdit();
        } catch (error) {
            console.error("Error actualizando el cliente: ", error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setSelectedClientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <>
            <Admin />
            <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
                <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
                    <Typography
                        variant="h3"
                        textAlign="center"
                        className={`generarQR_titulo ${isDarkMode ? "dark-mode" : ""}`}
                    >
                        Clientes
                    </Typography>
                    <div className="container-input">
                        <input
                            type="text"
                            placeholder="Buscar Cliente"
                            name="text"
                            className="input"
                            onChange={handleSearchChange}
                        />
                        <svg
                            fill="#000000"
                            width="20px"
                            height="20px"
                            viewBox="0 0 1920 1920"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
                                fillRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                </div>

                <div className={isDarkMode ? "dark-mode" : "light-mode"}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Apellido</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>RUT</TableCell>
                                    <TableCell>Teléfono</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clientesFiltrado
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((cliente) => (
                                        <TableRow key={cliente.id}>
                                            <TableCell>{cliente.nombre}</TableCell>
                                            <TableCell>{cliente.apellido}</TableCell>
                                            <TableCell>{cliente.email}</TableCell>
                                            <TableCell>{cliente.rut}</TableCell>
                                            <TableCell>{cliente.telefono}</TableCell>
                                            <TableCell>
                                                <Button
                                                    color="primary"
                                                    onClick={() => handleClickOpenEdit(cliente)}
                                                >
                                                    <EditIcon />
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={() => handleClickOpenDelete(cliente.id)}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10, 15, 25]}
                            component="div"
                            count={clientesFiltrado.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </div>
            </div>

            {/* Diálogo de confirmación de eliminación */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description">
                        ¿Estás seguro de que quieres eliminar este cliente?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de edición */}
            <Dialog
                open={openEditDialog}
                onClose={handleCloseEdit}
                aria-labelledby="edit-dialog-title"
            >
                <DialogTitle id="edit-dialog-title">Editar Cliente</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="nombre"
                        label="Nombre"
                        type="text"
                        fullWidth
                        value={selectedClientData.nombre || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="apellido"
                        label="Apellido"
                        type="text"
                        fullWidth
                        value={selectedClientData.apellido || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={selectedClientData.email || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="rut"
                        label="RUT"
                        type="text"
                        fullWidth
                        value={selectedClientData.rut || ""}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="telefono"
                        label="Teléfono"
                        type="text"
                        fullWidth
                        value={selectedClientData.telefono || ""}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Actualizar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListarCliente;
