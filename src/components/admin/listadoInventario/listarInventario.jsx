import React, { useState, useEffect, useContext } from "react";
import "../../styles/darkMode.css";
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
import { DarkModeContext } from "../../../context/darkMode";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

const ListarInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [inventarioFiltrado, setInventarioFiltrado] = useState([]);
  const [editingInventarioId, setEditingInventarioId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteInventarioId, setDeleteInventarioId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "inventario")),
      (querySnapshot) => {
        const inventarioData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventario(inventarioData);
        setInventarioFiltrado(inventarioData);
      }
    );

    return () => unsubscribe();
  }, []);

  const startDelete = (inventarioId) => {
    setDeleteInventarioId(inventarioId);
    setOpenDeleteDialog(true);
  };

  const cancelDelete = () => {
    setDeleteInventarioId(null);
    setOpenDeleteDialog(false);
  };

  const deleteInventario = async (inventarioId) => {
    try {
      await deleteDoc(doc(db, "inventario", inventarioId));
      setInventario((prevInventario) =>
        prevInventario.filter((inventario) => inventario.id !== inventarioId)
      );
      setInventarioFiltrado((prevInventario) =>
        prevInventario.filter((inventario) => inventario.id !== inventarioId)
      );
      console.log("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
    }
  };

  const startEditing = (inventarioId) => {
    setEditingInventarioId(inventarioId);
    setIsEditingModalOpen(true);
  };

  const cancelEditing = () => {
    setEditingInventarioId(null);
    setIsEditingModalOpen(false);
  };

  const saveEdit = async (inventarioId, updatedData) => {
    try {
      await updateDoc(doc(db, "inventario", inventarioId), updatedData);
      setEditingInventarioId(null);
      setIsEditingModalOpen(false);
      console.log("producto actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  const filtrarInventario = (e) => {
    const texto = e.target.value.toLowerCase();

    if (texto === "") {
      setInventarioFiltrado(inventario);
    } else {
      const inventarioFiltrados = inventario.filter((item) => {
        const {
          codigoProducto,
          nombreProducto,
          categoria,
          marca,
          cantidad,
          costo,
        } = item;

        const codigoProductoLower = codigoProducto.toLowerCase();
        const nombreProductoLower = nombreProducto.toLowerCase();
        const categoriaLower = categoria.toLowerCase();
        const marcaLower = marca.toLowerCase();
        const cantidadLower = cantidad.toString().toLowerCase();
        const costoLower = costo.toString().toLowerCase();

        return (
          codigoProductoLower.includes(texto) ||
          nombreProductoLower.includes(texto) ||
          categoriaLower.includes(texto) ||
          marcaLower.includes(texto) ||
          cantidadLower.includes(texto) ||
          costoLower.includes(texto)
        );
      });
      setInventarioFiltrado(inventarioFiltrados);
    }
  };

  const handleInputChange = (inventarioId, name, value) => {
    const updatedInventario = inventario.map((inventario) =>
      inventario.id === inventarioId
        ? { ...inventario, [name]: value }
        : inventario
    );
    setInventario(updatedInventario);
    setInventarioFiltrado(updatedInventario);
  };

  const agregarInventario = () => {
    navigate("/agregarInventario");
  };

  const getRowStyle = (cantidad) => {
    return cantidad <= 10 ? { backgroundColor: "#ffcccc" } : {};
  };

  const formatoDinero = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
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
            Listado Inventario
          </Typography>
          <div>
            <Box>
              <TextField
                onChange={filtrarInventario}
                id="Buscar Usuario"
                label="Buscar Inventario"
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
                onClick={agregarInventario}
                sx={{ width: "250px", height: "55px", marginTop: "10px" }}
              >
                Ingresar Nuevo Inventario
              </Button>
            </Box>
          </div>
        </div>
        <div className="table_section">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código Producto</TableCell>
                  <TableCell>Nombre Producto</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventarioFiltrado.map((inventario) => (
                  <TableRow
                    key={inventario.id}
                    style={getRowStyle(inventario.cantidad)}
                  >
                    <TableCell>{inventario.codigoProducto}</TableCell>
                    <TableCell>{inventario.nombreProducto}</TableCell>
                    <TableCell>{inventario.categoria}</TableCell>
                    <TableCell>{inventario.marcaProducto}</TableCell>
                    <TableCell>{inventario.cantidad}</TableCell>
                    <TableCell>{formatoDinero(inventario.costo)}</TableCell>
                    <TableCell>
                      {editingInventarioId === inventario.id ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                          }}
                          className="fondo_no"
                        >
                          <Paper
                            elevation={3}
                            style={{ width: "500px", padding: "20px" }}
                          >
                            <Typography
                              variant="h5"
                              className={`formulario_titulo ${
                                isDarkMode ? "dark-mode" : ""
                              }`}
                            >
                              Editar inventario
                            </Typography>
                            <TextField
                              label="Codigo Producto"
                              value={inventario.codigoProducto}
                              onChange={(e) =>
                                handleInputChange(
                                  inventario.id,
                                  "codigoProducto",
                                  e.target.value
                                )
                              }
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            />
                            <TextField
                              label="Nombre Producto"
                              value={inventario.nombreProducto}
                              onChange={(e) =>
                                handleInputChange(
                                  inventario.id,
                                  "nombreProducto",
                                  e.target.value
                                )
                              }
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            />
                            <FormControl
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            >
                              <InputLabel id="categoria-label">
                                Categoría
                              </InputLabel>
                              <Select
                                labelId="categoria-label"
                                id="categoria"
                                value={inventario.categoria}
                                onChange={(e) =>
                                  handleInputChange(
                                    inventario.id,
                                    "categoria",
                                    e.target.value
                                  )
                                }
                                label="Categoría"
                              >
                                <MenuItem value="" disabled>
                                  Seleccione una categoría
                                </MenuItem>
                                <MenuItem value="Sistema de Suspensión">
                                  Sistema de Suspensión
                                </MenuItem>
                                <MenuItem value={"Afinación del Motor"}>
                                  Afinación del Motor
                                </MenuItem>
                                <MenuItem
                                  value={"Sistema de Inyección Electrónica"}
                                >
                                  Sistema de Inyección Electrónica
                                </MenuItem>
                                <MenuItem value={"Sistema de Escape"}>
                                  Sistema de Escape
                                </MenuItem>
                                <MenuItem value={"Sistema de Climatización"}>
                                  Sistema de Climatización
                                </MenuItem>
                                <MenuItem value={"Sistema de Lubricación"}>
                                  Sistema de Lubricación
                                </MenuItem>
                                <MenuItem value={"Sistema de Dirección"}>
                                  Sistema de Dirección
                                </MenuItem>
                                <MenuItem value={"Sistema de Frenos"}>
                                  Sistema de Frenos
                                </MenuItem>
                                <MenuItem value={"Sistema de Encendido"}>
                                  Sistema de Encendido
                                </MenuItem>
                                <MenuItem
                                  value={"Inspección de Carrocería y Pintura"}
                                >
                                  Inspección de Carrocería y Pintura
                                </MenuItem>
                                <MenuItem value={"Sistema de Transmisión"}>
                                  Sistema de Transmisión
                                </MenuItem>
                                <MenuItem value={"Sistema de Refrigeración"}>
                                  Sistema de Refrigeración
                                </MenuItem>
                                <MenuItem
                                  value={"Accesorios y Personalización"}
                                >
                                  Accesorios y Personalización
                                </MenuItem>
                                <MenuItem value={"Herramientas y Equipos"}>
                                  Herramientas y Equipos
                                </MenuItem>
                              </Select>
                            </FormControl>
                            <TextField
                              label="Marca"
                              value={inventario.marcaProducto}
                              onChange={(e) =>
                                handleInputChange(
                                  inventario.id,
                                  "marca",
                                  e.target.value
                                )
                              }
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            />
                            <TextField
                              label="Cantidad"
                              value={inventario.cantidad}
                              onChange={(e) =>
                                handleInputChange(
                                  inventario.id,
                                  "cantidad",
                                  e.target.value
                                )
                              }
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            />
                            <TextField
                              label="Costo"
                              value={inventario.costo}
                              onChange={(e) =>
                                handleInputChange(
                                  inventario.id,
                                  "costo",
                                  e.target.value
                                )
                              }
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            />
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              width="100%"
                            >
                              <Button
                                onClick={() => {
                                  saveEdit(inventario.id, inventario);
                                }}
                                variant="contained"
                                startIcon={<CheckIcon />}
                              >
                                Aplicar
                              </Button>
                              <Button
                                onClick={() => cancelEditing()}
                                variant="contained"
                                color="error"
                                startIcon={<CloseIcon />}
                              >
                                Cancelar
                              </Button>
                            </Box>
                          </Paper>
                        </div>
                      ) : (
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() => startEditing(inventario.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {deleteInventarioId === inventario.id ? (
                        <Dialog
                          open={openDeleteDialog}
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
                              ¿Estás seguro de que deseas eliminar este
                              producto?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions
                            className={`${isDarkMode ? "dark-mode" : ""}`}
                          >
                            <Button onClick={cancelDelete} color="primary">
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => deleteInventario(inventario.id)}
                              color="secondary"
                            >
                              Eliminar
                            </Button>
                          </DialogActions>
                        </Dialog>
                      ) : (
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() => startDelete(inventario.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default ListarInventario;
