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
  faFilePen,
  faTrash,
  faSearch,
  faCheck,
  faXmark,
  faDownload,
  faCartFlatbed,
} from "@fortawesome/free-solid-svg-icons";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
library.add(
  faFilePen,
  faTrash,
  faSearch,
  faCheck,
  faXmark,
  faDownload,
  faCartFlatbed
);

const ListarInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [inventarioFiltrado, setInventarioFiltrado] = useState([]);
  const [editingInventarioId, setEditingInventarioId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteInventarioId, setDeleteInventarioId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteInventarioId(null);
    setIsDeleteModalOpen(false);
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
      console.log("Factura eliminada correctamente.");
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
      console.log("Factura actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la factura:", error);
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

  return (
    <>
      <Admin />
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Listado Inventario</h1>
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
                  <TableCell>Costo</TableCell>
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
                    <TableCell>{inventario.marca}</TableCell>
                    <TableCell>{inventario.cantidad}</TableCell>
                    <TableCell>{inventario.costo}</TableCell>
                    <TableCell>
                      {editingInventarioId === inventario.id ? (
                        <div className="fondo_no">
                          <div className="editar">
                            <p className="p_editar">Editar inventario</p>
                            <p className="p_editar">
                              <label htmlFor="">Codigo Producto</label>
                              <input
                                type="text"
                                value={inventario.codigoProducto}
                                onChange={(e) =>
                                  handleInputChange(
                                    inventario.id,
                                    "codigoProducto",
                                    e.target.value
                                  )
                                }
                              />
                            </p>
                            <p className="p_editar">
                              <label htmlFor="">Nombre Producto</label>
                              <input
                                type="text"
                                value={inventario.nombreProducto}
                                onChange={(e) =>
                                  handleInputChange(
                                    inventario.id,
                                    "nombreProducto",
                                    e.target.value
                                  )
                                }
                              />
                            </p>
                            <p>
                              <label htmlFor="">Categoria</label>
                              <br />
                              <select
                                id="categoria"
                                required
                                name="categoria"
                                onChange={(e) =>
                                  handleInputChange(
                                    inventario.id,
                                    "categoria",
                                    e.target.value
                                  )
                                }
                              >
                                <option
                                  value={inventario.categoria}
                                  disabled
                                  defaultValue={inventario.categoria}
                                >
                                  Seleccione una categoría
                                </option>
                                <option value="Sistema de Suspensión">
                                  Sistema de Suspensión
                                </option>
                                <option value="Afinación del Motor">
                                  Afinación del Motor
                                </option>
                                <option value="Sistema de Inyección Electrónica">
                                  Sistema de Inyección Electrónica
                                </option>
                                <option value="Sistema de Escape">
                                  Sistema de Escape
                                </option>
                                <option value="Sistema de Climatización">
                                  Sistema de Climatización
                                </option>
                                <option value="Sistema de Lubricación">
                                  Sistemas de Lubricación
                                </option>
                                <option value="Sistema de Dirección">
                                  Sistema de Dirección
                                </option>
                                <option value="Sistema de Frenos">
                                  Sistema de Frenos
                                </option>
                                <option value="Sistema de Encendido">
                                  Sistema de Encendido
                                </option>
                                <option value="Inspección de Carrocería y Pintura">
                                  Inspección de Carrocería y Pintura
                                </option>
                                <option value="Sistema de Transmisión">
                                  Sistema de Transmisión
                                </option>
                                <option value="Sistema de Refrigeración">
                                  Sistema de Refrigeración
                                </option>
                              </select>
                            </p>
                            <p className="p_editar">
                              <label htmlFor="">Marca</label>
                              <input
                                type="text"
                                value={inventario.marca}
                                onChange={(e) =>
                                  handleInputChange(
                                    inventario.id,
                                    "marca",
                                    e.target.value
                                  )
                                }
                              />
                            </p>
                            <p className="p_editar">
                              <label htmlFor="">Cantidad</label>
                              <input
                                type="text"
                                value={inventario.cantidad}
                                onChange={(e) =>
                                  handleInputChange(
                                    inventario.id,
                                    "cantidad",
                                    e.target.value
                                  )
                                }
                              />
                            </p>
                            <p className="p_editar">
                              <label htmlFor="">Costo</label>
                              <input
                                type="text"
                                value={inventario.costo}
                                onChange={(e) =>
                                  handleInputChange(
                                    inventario.id,
                                    "costo",
                                    e.target.value
                                  )
                                }
                              />
                            </p>
                            <button
                              className="guardar"
                              onClick={() =>
                                saveEdit(inventario.id, inventario)
                              }
                            >
                              <FontAwesomeIcon icon="fa-solid fa-check" />
                            </button>
                            <button
                              className="cancelar"
                              onClick={() => cancelEditing()}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-xmark" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => startEditing(inventario.id)}>
                          <FontAwesomeIcon icon="fa-solid fa-file-pen" />
                        </button>
                      )}
                      {deleteInventarioId === inventario.id ? (
                        <div className="fondo_no">
                          <div className="editar">
                            <p className="p_editar">
                              ¿Estás seguro que deseas <br /> eliminar este
                              producto?
                            </p>
                            <button
                              className="guardar"
                              onClick={() => deleteInventario(inventario.id)}
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
                      ) : (
                        <button onClick={() => startDelete(inventario.id)}>
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

export default ListarInventario;
