import "../../styles/listarUsuario.css";
import "../../styles/darkMode.css";
import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../../context/darkMode";
import Admin from "../admin";
import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PrevisualizarUsuario from "./previsualizarUsuario";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ListarUsuario = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const formatSalario = (value) => {
    return parseInt(value, 10).toLocaleString("es-CL");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users")),
      (querySnapshot) => {
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
        setFilteredUsers(usersData);
      }
    );

    return () => unsubscribe();
  }, []);

  const startDelete = (userId) => {
    setDeleteUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteUserId(null);
    setIsDeleteModalOpen(false);
  };

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
      console.log("Usuario eliminado correctamente.");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const startEditing = (userId) => {
    setEditingUserId(userId);
    setIsEditingModalOpen(true);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setIsEditingModalOpen(false);
  };

  const saveEdit = async (userId, updatedData) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updatedData);
      console.log("Usuario actualizado correctamente.");
      setIsEditingModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const handleInputChange = (userId, name, value) => {
    let updatedValue = value;

    if (name === "salario") {
      updatedValue = value.replace(/[^\d]/g, "");
    }

    const updatedUsers = filteredUsers.map((user) =>
      user.id === userId ? { ...user, [name]: updatedValue } : user
    );
    setFilteredUsers(updatedUsers);
  };

  const filtrarUsuario = (e) => {
    const texto = e.target.value.toLowerCase();
    const filtro = users.filter((user) => {
      return (
        user.nombre.toLowerCase().includes(texto) ||
        user.apellido.toLowerCase().includes(texto) ||
        user.rut.toLowerCase().includes(texto) ||
        user.telefono.toLowerCase().includes(texto) ||
        user.direccion.toLowerCase().includes(texto) ||
        user.email.toLowerCase().includes(texto) ||
        user.rol.toLowerCase().includes(texto) ||
        user.salario.toLowerCase().includes(texto) ||
        user.fechaIngreso.toLowerCase().includes(texto)
      );
    });
    setFilteredUsers(filtro);

    if (texto === "") {
      setFilteredUsers(users);
    }
  };

  const agregarUsuario = () => {
    navigate("/agregarUsuario");
  };

  const translateRol = (rol) => {
    switch (rol) {
      case "administrador":
        return "Administrador";
      case "mecanico":
        return "Mecánico";
      default:
        return rol;
    }
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
            Usuarios
          </Typography>
          <div>
            <Box>
              <TextField
                onChange={filtrarUsuario}
                id="Buscar Usuario"
                label="Buscar Usuario"
                variant="outlined"
                sx={{
                  width: "220px",
                  height: "55px",
                  marginTop: "10px",
                  right: "20px",
                }}
                className={isDarkMode ? "dark-mode" : ""}
              />
              <Button
                variant="outlined"
                onClick={agregarUsuario}
                sx={{ width: "220px", height: "55px", marginTop: "10px" }}
                className={isDarkMode ? "dark-mode" : ""}
              >
                Ingresar Nuevo Usuario
              </Button>
            </Box>
          </div>
        </div>
        <TableContainer
          className={`custom-table-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>RUT</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Correo Electrónico</TableCell>
                <TableCell>Cargo de trabajo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.rut}</TableCell>
                  <TableCell>
                    {user.nombre} {user.apellido}
                  </TableCell>
                  <TableCell>{user.telefono}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{translateRol(user.rol)}</TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <PrevisualizarUsuario
                        user={user}
                        onSave={saveEdit}
                        onCancel={cancelEditing}
                        onInputChange={handleInputChange}
                      />
                    ) : (
                      <>
                        <Button
                          onClick={() => startEditing(user.id)}
                          className={isDarkMode ? "dark-mode" : ""}
                          startIcon={<EditIcon />}
                          variant="outlined"
                          sx={{ color: "white" }}
                        ></Button>
                      </>
                    )}
                    {deleteUserId === user.id ? (
                      <Dialog
                        open={startDelete}
                        onClose={cancelDelete}
                        className={`${isDarkMode ? "dark-mode" : ""}`}
                      >
                        <DialogTitle
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          Confirmar Eliminación
                        </DialogTitle>
                        <DialogContent
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          <DialogContentText
                            className={`${isDarkMode ? "dark-mode" : ""}`}
                          >
                            ¿Estás seguro de que deseas eliminar este usuario?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          <Button onClick={cancelDelete} color="primary">
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => deleteUser(user.id)}
                            color="secondary"
                          >
                            Eliminar
                          </Button>
                        </DialogActions>
                      </Dialog>
                    ) : (
                      <Button
                        onClick={() => startDelete(user.id)}
                        className={isDarkMode ? "dark-mode" : ""}
                        startIcon={<DeleteIcon />}
                        sx={{ color: "white", left: "12px" }}
                      ></Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default ListarUsuario;
