import "../../styles/listarUsuario.css";
import React, { useState, useEffect } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUserPen,
  faTrash,
  faMagnifyingGlass,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
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
library.add(faUserPen, faTrash, faMagnifyingGlass, faCheck, faXmark);

const ListarUsuario = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  return (
    <>
      <Admin />
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Listar Usuarios</h1>
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
              />
              <Button
                variant="outlined"
                onClick={agregarUsuario}
                sx={{ width: "220px", height: "55px", marginTop: "10px" }}
              >
                Ingresar Nuevo Usuario
              </Button>
            </Box>
          </div>
        </div>
        <TableContainer component={Paper}>
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
                  <TableCell>{user.rol}</TableCell>
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
                        <button onClick={() => startEditing(user.id)}>
                          <FontAwesomeIcon icon={faUserPen} />
                        </button>
                      </>
                    )}
                    {deleteUserId === user.id ? (
                      <>
                        <div className="fondo_no">
                          <div className="editar">
                            <p className="p_editar">
                              ¿Estás seguro de que deseas <br /> eliminar este
                              usuario?
                            </p>
                            <button
                              className="guardar"
                              onClick={() => deleteUser(user.id)}
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button className="cancelar" onClick={cancelDelete}>
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <button onClick={() => startDelete(user.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
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
