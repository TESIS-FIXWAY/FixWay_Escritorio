import React, { useState, useEffect } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditarUsuarioModalFactura from "./editarUsuarioModalFactura";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFilePen,
  faTrash,
  faMagnifyingGlass,
  faCheck,
  faDownload,
  faXmark,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faFilePen,
  faTrash,
  faMagnifyingGlass,
  faCheck,
  faXmark,
  faDownload,
  faFileCirclePlus
);
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

const ListadoFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [facturaFiltrada, setFacturaFiltrada] = useState([]);
  const navigate = useNavigate();
  const [editingFacturaId, setEditingFacturaId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteFacturaId, setDeleteFacturaId] = useState(null);
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const editarUsuarioModalFactura = ({
    factura,
    onSave,
    onCancel,
    onInputChange,
  }) => {
    return (
      <EditarUsuarioModalFactura
        factura={factura}
        onSave={onSave}
        onCancel={onCancel}
        onInputChange={onInputChange}
      />
    );
  };

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
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteFacturaId(null);
    setIsDeleteModalOpen(false);
  };

  const deleteFactura = async (facturaId) => {
    try {
      const factura = facturas.find((factura) => factura.id === facturaId);
      if (!factura) {
        throw new Error("Factura no encontrada");
      }

      const fileRef = ref(storage, factura.url);
      await deleteObject(fileRef);

      await deleteDoc(doc(db, "facturas", facturaId));

      setFacturas((prevFactura) =>
        prevFactura.filter((factura) => factura.id !== facturaId)
      );
      setFacturaFiltrada((prevFactura) =>
        prevFactura.filter((factura) => factura.id !== facturaId)
      );
      console.log("Factura eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
    }
  };

  const startEditing = (facturaId) => {
    setEditingFacturaId(facturaId);
    setIsEditingModalOpen(true);
  };

  const cancelEditing = () => {
    setEditingFacturaId(null);
    setIsEditingModalOpen(false);
  };

  const saveEdit = async (facturaId, updatedData) => {
    try {
      await updateDoc(doc(db, "facturas", facturaId), updatedData);
      setEditingFacturaId(null);
      setIsEditingModalOpen(false);
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

  const onInputChange = (name, value) => {
    const updatedFacturas = facturas.map((factura) =>
      factura.id === editingFacturaId ? { ...factura, [name]: value } : factura
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
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Listado Facturas Proveedores</h1>
          <div>
            <Box>
              <TextField
                onChange={filtrarFactura}
                id="Buscar Usuario"
                label="Buscar Factura"
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
                onClick={agregarFactura}
                sx={{ width: "220px", height: "55px", marginTop: "10px" }}
              >
                Ingresar Nueva Factura
              </Button>
            </Box>
          </div>
        </div>
        <div className="table_section">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proveedor</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facturaFiltrada.map((factura) => (
                  <TableRow key={factura.id}>
                    <TableCell>{factura.proveedor}</TableCell>
                    <TableCell>{factura.fecha}</TableCell>
                    <TableCell>{factura.detalle}</TableCell>
                    <TableCell>
                      {editingFacturaId === factura.id ? (
                        <>
                          <div className="fondo_no">
                            <div className="editar">
                              <p className="p_editar">
                                <label className="etiqueta_editar">
                                  Proveedor
                                </label>
                                <input
                                  type="text"
                                  value={factura.proveedor}
                                  onChange={(e) =>
                                    onInputChange("proveedor", e.target.value)
                                  }
                                />
                              </p>
                              <p className="p_editar">
                                <label className="etiqueta_editar">Fecha</label>
                                <input
                                  type="date"
                                  value={factura.fecha}
                                  onChange={(e) =>
                                    onInputChange("fecha", e.target.value)
                                  }
                                />
                              </p>
                              <p className="p_editar">
                                <label className="etiqueta_editar">
                                  Detalle
                                </label>
                                <input
                                  type="text"
                                  value={factura.detalle}
                                  onChange={(e) =>
                                    onInputChange("detalle", e.target.value)
                                  }
                                />
                              </p>
                              <button
                                className="guardar"
                                onClick={() =>
                                  saveEdit(factura.id, {
                                    proveedor: factura.proveedor,
                                    fecha: factura.fecha,
                                    detalle: factura.detalle,
                                  })
                                }
                              >
                                <FontAwesomeIcon icon="fa-solid fa-check" />
                              </button>
                              <button
                                className="cancelar"
                                onClick={cancelEditing}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-xmark" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <button onClick={() => startEditing(factura.id)}>
                          <FontAwesomeIcon icon="fa-solid fa-file-pen" />
                        </button>
                      )}
                      <button style={{ backgroundColor: "#1DC258" }}>
                        <FontAwesomeIcon
                          onClick={() => downloadPDF(factura.url)}
                          icon={faDownload}
                        />
                      </button>
                      {deleteFacturaId === factura.id ? (
                        <>
                          <div className="fondo_no">
                            <div className="editar">
                              <p className="p_editar">
                                ¿Estás seguro de que deseas <br /> eliminar esta
                                factura?
                              </p>
                              <button
                                className="guardar"
                                onClick={() => deleteFactura(factura.id)}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-check" />
                              </button>
                              <button
                                className="cancelar"
                                onClick={() => cancelDelete()}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-xmark" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => startDelete(factura.id)}
                          style={{ backgroundColor: "red" }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-trash" />
                        </button>
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

export default ListadoFacturas;
