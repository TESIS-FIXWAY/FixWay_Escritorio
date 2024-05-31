import React, { useState, useEffect } from "react";
import Mecanico from "./mecanico";
import { db } from "../../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const ListarInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [filteredInventario, setFilteredInventario] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "inventario")),
      (querySnapshot) => {
        const inventarioData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventario(inventarioData);
        setFilteredInventario(inventarioData);
      }
    );

    return () => unsubscribe();
  }, [refresh]);

  const filtrarInventario = (e) => {
    const texto = e.target.value.toLowerCase();
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
    setInventario(inventarioFiltrados);

    if (texto === "") {
      setRefresh((prevRefresh) => !prevRefresh);
    }
  };

  const getRowStyle = (cantidad) => {
    return cantidad <= 10 ? { backgroundColor: "#ffcccc" } : {};
  };

  return (
    <>
      <Mecanico />
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Listado Inventario</h1>
          <div>
            <Box>
              <TextField
                onChange={filtrarInventario}
                type="text"
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
                </TableRow>
              </TableHead>
              <TableBody>
                {inventario.map((inventario) => (
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
