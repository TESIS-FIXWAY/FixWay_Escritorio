import "../../styles/darkMode.css";
import React, { useEffect, useState, useContext } from "react";
import Admin from "../admin";
import { db } from "../../../firebase";
import { DarkModeContext } from "../../../context/darkMode";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { collection, onSnapshot, query } from "firebase/firestore";

export default function ListadoAutomovil() {
  const [auto, setAuto] = useState([]);
  const [filteredAuto, setFilteredAuto] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "automoviles")),
      (querySnapshot) => {
        const automovilData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAuto(automovilData);
        setFilteredAuto(automovilData);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = auto.filter((a) =>
      a.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAuto(filtered);
  }, [searchTerm, auto]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const agregarAutomovil = () => {
    window.location.href = "/agregarAutomovilAdmin";
  };

  const formatoKilometro = (amount) => {
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
            Listado Automóvil
          </Typography>
          <div>
            <Box>
              <TextField
                onChange={handleSearchChange}
                id="Buscar Automóvil"
                label="Buscar Automóvil"
                variant="outlined"
                sx={{
                  width: "220px",
                  height: "55px",
                  marginTop: "10px",
                }}
                className={isDarkMode ? "dark-mode" : ""}
              />
              <Button
                variant="outlined"
                onClick={agregarAutomovil}
                sx={{ width: "220px", height: "55px", marginTop: "10px" }}
                className={isDarkMode ? "dark-mode" : ""}
              >
                Ingresar Nuevo Automóvil
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
                <TableCell>Patente</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Kilometro</TableCell>
                <TableCell>Numero Chasis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAuto.map((auto) => (
                <TableRow key={auto.id}>
                  <TableCell>{auto.id}</TableCell>
                  <TableCell>{auto.marca}</TableCell>
                  <TableCell>{auto.modelo}</TableCell>
                  <TableCell>{auto.ano}</TableCell>
                  <TableCell>{auto.color}</TableCell>
                  <TableCell>{formatoKilometro(auto.kilometraje)}</TableCell>
                  <TableCell>{auto.numchasis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
