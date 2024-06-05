import React, { useState, useEffect } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const HistorialMantencionAdmin = () => {
  const [mantenciones, setMantenciones] = useState([]);
  const [mantencionesFiltradas, setMantencionesFiltradas] = useState([]);

  useEffect(() => {
    const fetchMantenciones = async () => {
      try {
        const mantencionesCollection = collection(db, "historialMantencion");
        const snapshot = await getDocs(mantencionesCollection);
        const mantencionesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMantenciones(mantencionesData);
        setMantencionesFiltradas(mantencionesData);
      } catch (error) {
        console.error("Error fetching mantenciones:", error);
      }
    };

    fetchMantenciones();
  }, []);

  const filtrarPatente = (e) => {
    const texto = e.target.value.toLowerCase();
    if (texto === "") {
      setMantencionesFiltradas(mantenciones);
    } else {
      const mantencionesFiltradas = mantenciones.filter((item) => {
        const patente = item.id.toLowerCase();
        return patente.includes(texto);
      });
      setMantencionesFiltradas(mantencionesFiltradas);
    }
  };

  const generarPDF = (mantencion) => {
    const pdf = new jsPDF();

    // Logo
    const imgData = "../../images/LogoSinFondo.png";
    const imgWidth = 40;
    const imgHeight = 40;
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10;
    const imgY = -10;
    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);

    // Título
    pdf.setFontSize(24);
    pdf.text(
      "Historial de Mantenciones",
      pdf.internal.pageSize.getWidth() / 2,
      15,
      {
        align: "center",
      }
    );

    // Línea separadora
    const lineSeparatorY = 20;
    pdf.line(
      5,
      lineSeparatorY,
      pdf.internal.pageSize.getWidth() - 5,
      lineSeparatorY
    );

    // Fecha
    const today = new Date();
    const dateString = today.toLocaleDateString();
    pdf.setFontSize(10);
    pdf.text(`Fecha: ${dateString}`, pdf.internal.pageSize.getWidth() - 45, 40);

    // Detalles de la mantención
    pdf.setFontSize(12);
    pdf.text(`Mantención`, 20, 60);
    pdf.setFontSize(10);
    pdf.text(`Patente: ${mantencion.id}`, 30, 70);
    pdf.text(`Descripción: ${mantencion.descripcion}`, 30, 80);
    pdf.text(`Tipo de Mantención: ${mantencion.tipoMantencion}`, 30, 90);
    pdf.text(`Fecha: ${formatDate(new Date(mantencion.fecha))}`, 30, 100);

    pdf.text(`Productos Utilizados:`, 30, 110);
    const productos = mantencion.productos;
    let yProductos = 120;
    productos.forEach((producto) => {
      producto.nombreProducto = producto.nombreProducto.replace(/_/g, " ");
      pdf.text(`- ${producto.nombreProducto}`, 40, yProductos);
      yProductos += 10;
    });

    const blob = new Blob([pdf.output("blob")], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${mantencion.id}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatoKilometraje = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  return (
    <>
      <Admin />
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Historial Mantención</h1>
          <div>
            <Box>
              <TextField
                onChange={filtrarPatente}
                type="text"
                id="Buscar Usuario"
                label="Buscar Patente"
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
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Kilometraje de Mantención</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mantencionesFiltradas.map((mantencion) => (
                  <TableRow key={mantencion.id}>
                    <TableCell>{mantencion.patente}</TableCell>
                    <TableCell>
                      {formatDate(new Date(mantencion.fecha))}
                    </TableCell>
                    <TableCell>
                      {formatoKilometraje(mantencion.kilometrajeMantencion)}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => generarPDF(mantencion)}
                        variant="contained"
                        color="secondary"
                      >
                        Descargar
                      </Button>
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

export default HistorialMantencionAdmin;
