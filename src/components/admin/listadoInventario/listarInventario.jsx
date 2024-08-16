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
  const {isDarkMode} = useContext(DarkModeContext);
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
      setInventarioFiltrado(inventario); // Muestra todo el inventario si el campo de búsqueda está vacío
    } else {
      const inventarioFiltrados = inventario.filter((item) => {
        const {
          anoProductoUsoFin,
          anoProductoUsoInicio,
          codigoProducto,
          nombreProducto,
          descripcion,
          marcaAutomovil,
          categoria,
          marcaProducto,
          origen,
          cantidad,
          costo,
        } = item;
  
        return (
          (codigoProducto && codigoProducto.toLowerCase().includes(texto)) ||
          (nombreProducto && nombreProducto.toLowerCase().includes(texto)) ||
          (descripcion && descripcion.toLowerCase().includes(texto)) ||
          (marcaAutomovil && marcaAutomovil.toLowerCase().includes(texto)) ||
          (categoria && categoria.toLowerCase().includes(texto)) ||
          (marcaProducto && marcaProducto.toLowerCase().includes(texto)) ||
          (origen && origen.toLowerCase().includes(texto)) ||
          (anoProductoUsoInicio && anoProductoUsoInicio.toString().includes(texto)) ||
          (anoProductoUsoFin && anoProductoUsoFin.toString().includes(texto)) ||
          (cantidad && cantidad.toString().includes(texto)) ||
          (costo && costo.toString().includes(texto))
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
            Inventario
          </Typography>
          <div className="container-input">
            <input type="text" placeholder="Buscar producto" name="text" className="input" onChange={filtrarInventario}/>
            <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
              <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fillRule="evenodd"></path>
            </svg>
          </div>
          
          <button type="button" class="button_agregar" onClick={agregarInventario}>
            <span class="button__text">Agregar Producto</span>
            <span class="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
          </button>
        
        </div>
        <div className="table_section">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>Año</TableCell>
                  <TableCell>Código</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Vehículo</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Origen</TableCell>
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
                    <TableCell>{inventario.anoProductoUsoInicio}-{inventario.anoProductoUsoFin}</TableCell>
                    <TableCell>{inventario.codigoProducto}</TableCell>
                    <TableCell>{inventario.nombreProducto}</TableCell>
                    <TableCell>{inventario.categoria}</TableCell>
                    <TableCell>{inventario.marcaAutomovil}</TableCell>
                    <TableCell>{inventario.marcaProducto}</TableCell>
                    <TableCell>{inventario.origen}</TableCell>
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
