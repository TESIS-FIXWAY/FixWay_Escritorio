import React, { useState, useEffect, useContext } from "react";
import "../../styles/darkMode.css";
import Admin from "../admin";
import { db, storage } from "../../../firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import EditarUsuarioModalFactura from "./editarUsuarioModalFactura";
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
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { DarkModeContext } from "../../../context/darkMode";

const ListadoFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [facturaFiltrada, setFacturaFiltrada] = useState([]);
  const navigate = useNavigate();
  const [editingFacturaId, setEditingFacturaId] = useState(null);
  const [deleteFacturaId, setDeleteFacturaId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "facturas")),
      (querySnapshot) => {
        const facturasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFacturas(facturasData);
        setFacturaFiltrada(facturasData);
      }
    );

    return () => unsubscribe();
  }, []);

  const startDelete = (facturaId) => {
    setDeleteFacturaId(facturaId);
    setOpenDeleteDialog(true);
  };

  const cancelDelete = () => {
    setDeleteFacturaId(null);
    setOpenDeleteDialog(false);
  };

  const deleteFactura = async () => {
    try {
      const factura = facturas.find(
        (factura) => factura.id === deleteFacturaId
      );
      if (!factura) {
        throw new Error("Factura no encontrada");
      }

      const fileRef = ref(storage, factura.url);
      await deleteObject(fileRef);

      await deleteDoc(doc(db, "facturas", deleteFacturaId));

      setFacturas((prevFactura) =>
        prevFactura.filter((factura) => factura.id !== deleteFacturaId)
      );
      setFacturaFiltrada((prevFactura) =>
        prevFactura.filter((factura) => factura.id !== deleteFacturaId)
      );
      console.log("Factura eliminada correctamente.");
      cancelDelete();
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
    }
  };

  const startEditing = (facturaId) => {
    setEditingFacturaId(facturaId);
  };

  const cancelEditing = () => {
    setEditingFacturaId(null);
  };

  const saveEdit = async (facturaId, updatedData) => {
    try {
      await updateDoc(doc(db, "facturas", facturaId), updatedData);
      setEditingFacturaId(null);
      console.log("Factura actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la factura:", error);
    }
  };

  const filtrarFactura = (e) => {
    const texto = e.target.value.toLowerCase();
    if (texto === "") {
      setFacturaFiltrada(facturas);
    } else {
      const facturasFiltrados = facturas.filter((factura) => {
        const proveedor = factura.proveedor.toLowerCase();
        const fecha = factura.fecha.toLowerCase();
        const detalle = factura.detalle.toLowerCase();
        return (
          proveedor.includes(texto) ||
          fecha.includes(texto) ||
          detalle.includes(texto)
        );
      });
      setFacturaFiltrada(facturasFiltrados);
    }
  };

  const downloadPDF = async (pdfPath) => {
    try {
      const storageRef = ref(storage, pdfPath);
      const url = await getDownloadURL(storageRef);
      console.log(url);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const onInputChange = (facturaId, name, value) => {
    const updatedFacturas = facturas.map((factura) =>
      factura.id === facturaId ? { ...factura, [name]: value } : factura
    );
    setFacturas(updatedFacturas);
    setFacturaFiltrada(updatedFacturas);
  };

  const agregarFactura = () => {
    navigate("/agregarFactura");
  };

  return (
    <>
      <Admin />
      <Box
        className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}
        sx={{ p: 2 }}
      >
        <Box
          className={`table_header ${isDarkMode ? "dark-mode" : ""}`}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h3"
            textAlign="center"
            className={`generarQR_titulo ${isDarkMode ? "dark-mode" : ""}`}
          >
            Listado de Facturas Proveedores
          </Typography>
          <Box>
            <TextField
              onChange={filtrarFactura}
              id="Buscar Factura"
              label="Buscar Factura"
              variant="outlined"
              className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
              sx={{ width: "220px", mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={agregarFactura}
              className={`${isDarkMode ? "dark-mode" : ""}`}
              sx={{ height: "55px" }}
            >
              Ingresar Nueva Factura
            </Button>
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          className={`${isDarkMode ? "dark-mode" : ""}`}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                  Proveedor
                </TableCell>
                <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                  Fecha
                </TableCell>
                <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                  Detalle
                </TableCell>
                <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturaFiltrada.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                    {editingFacturaId === factura.id ? (
                      <TextField
                        value={factura.proveedor}
                        onChange={(e) =>
                          onInputChange(factura.id, "proveedor", e.target.value)
                        }
                        className={`input_formulario ${
                          isDarkMode ? "dark-mode" : ""
                        }`}
                      />
                    ) : (
                      factura.proveedor
                    )}
                  </TableCell>
                  <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                    {editingFacturaId === factura.id ? (
                      <TextField
                        type="date"
                        value={factura.fecha}
                        onChange={(e) =>
                          onInputChange(factura.id, "fecha", e.target.value)
                        }
                        className={`input_formulario ${
                          isDarkMode ? "dark-mode" : ""
                        }`}
                      />
                    ) : (
                      factura.fecha
                    )}
                  </TableCell>
                  <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                    {editingFacturaId === factura.id ? (
                      <TextField
                        value={factura.detalle}
                        onChange={(e) =>
                          onInputChange(factura.id, "detalle", e.target.value)
                        }
                        className={`input_formulario ${
                          isDarkMode ? "dark-mode" : ""
                        }`}
                      />
                    ) : (
                      factura.detalle
                    )}
                  </TableCell>
                  <TableCell className={`${isDarkMode ? "dark-mode" : ""}`}>
                    {editingFacturaId === factura.id ? (
                      <>
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() =>
                            saveEdit(factura.id, {
                              proveedor: factura.proveedor,
                              fecha: factura.fecha,
                              detalle: factura.detalle,
                            })
                          }
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={cancelEditing}
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() => startEditing(factura.id)}
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "white" }}
                          onClick={() => startDelete(factura.id)}
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          sx={{ color: "black", background: "green" }}
                          onClick={() => downloadPDF(factura.url)}
                          className={`${isDarkMode ? "dark-mode" : ""}`}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDelete}
        className={`${isDarkMode ? "dark-mode" : ""}`}
      >
        <DialogTitle className={`${isDarkMode ? "dark-mode" : ""}`}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent className={`${isDarkMode ? "dark-mode" : ""}`}>
          <DialogContentText className={`${isDarkMode ? "dark-mode" : ""}`}>
            ¿Estás seguro de que deseas eliminar esta factura?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={`${isDarkMode ? "dark-mode" : ""}`}>
          <Button onClick={cancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteFactura} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListadoFacturas;
