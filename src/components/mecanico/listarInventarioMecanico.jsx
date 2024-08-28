import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/darkMode";
import Mecanico from "./mecanico";
import { db } from "../../dataBase/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

const ListarInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [filteredInventario, setFilteredInventario] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

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

  const formatoDinero = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  return (
    <>
      <Mecanico />
      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <Typography
            variant="h3"
            textAlign="center"
            className={`generarQR_titulo ${isDarkMode ? "dark-mode" : ""}`}
          >
            Listado de Inventario
          </Typography>
          <div>
            <Box>
              <TextField
                onChange={filtrarInventario}
                type="text"
                id="Buscar Inventario"
                label="Buscar Inventario"
                variant="outlined"
                sx={{
                  width: "220px",
                  height: "55px",
                  marginTop: "10px",
                  right: "20px",
                }}
                className={isDarkMode ? "dark-mode" : ""}
              />
            </Box>
          </div>
        </div>
        <div className="table_section">
          <TableContainer className={isDarkMode ? "dark-mode" : ""}>
            <Table className={isDarkMode ? "dark-mode" : ""}>
              <TableHead>
                <TableRow>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    Código Producto
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    Nombre Producto
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    Categoría
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    Marca
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    Cantidad
                  </TableCell>
                  <TableCell className={isDarkMode ? "dark-mode" : ""}>
                    Costo
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventario.map((inventario) => (
                  <TableRow
                    key={inventario.id}
                    style={getRowStyle(inventario.cantidad)}
                    className={isDarkMode ? "dark-mode" : ""}
                  >
                    <TableCell className={isDarkMode ? "dark-mode" : ""}>
                      {inventario.codigoProducto}
                    </TableCell>
                    <TableCell className={isDarkMode ? "dark-mode" : ""}>
                      {inventario.nombreProducto}
                    </TableCell>
                    <TableCell className={isDarkMode ? "dark-mode" : ""}>
                      {inventario.categoria}
                    </TableCell>
                    <TableCell className={isDarkMode ? "dark-mode" : ""}>
                      {inventario.marca}
                    </TableCell>
                    <TableCell className={isDarkMode ? "dark-mode" : ""}>
                      {inventario.cantidad}
                    </TableCell>
                    <TableCell className={isDarkMode ? "dark-mode" : ""}>
                      $ {formatoDinero(inventario.costo)}
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
