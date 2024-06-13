import "../styles/darkMode.css";
import React, { useState, useEffect, useContext } from "react";
import Admin from "./admin";
import { DarkModeContext } from "../../context/darkMode";
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
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Typography } from "@mui/material";

const HistorialMantencionAdmin = () => {
  const [mantenciones, setMantenciones] = useState([]);
  const [mantencionesFiltradas, setMantencionesFiltradas] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);

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
    setMantencionesFiltradas(
      texto === ""
        ? mantenciones
        : mantenciones.filter((item) =>
            item.id.toLowerCase().includes(texto)
          )
    );
  };

  const generarPDF = (mantencion, download = true) => {
    const pdf = new jsPDF();
    const imgData = "../../images/LogoSinFondo.png";
    const imgWidth = 40;
    const imgHeight = 40;
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10;
    const imgY = 10;

    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text("Historial de Mantenciones", pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(5, 25, pdf.internal.pageSize.getWidth() - 5, 25);

    const today = new Date();
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${today.toLocaleDateString()}`, pdf.internal.pageSize.getWidth() - 45, 35);

    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Productos Utilizados:`, 20, 115);
    pdf.setFontSize(12);
    const productos = mantencion.productos || [];
    const startX = 20;
    const startY = 125;
    const rowHeight = 10;
    const colWidths = [80, 40, 40];
    const headers = ["Producto", "Fecha Inicio", "Fecha Término"];
    const data = productos.map((producto) => [
      producto.nombreProducto || "Desconocido",
      formatDate(new Date(mantencion.fecha)),
      formatDate(new Date(mantencion.fechaTerminado)),
    ]);

    pdf.setFontSize(12);
    pdf.setFillColor(230, 230, 230);
    pdf.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
    pdf.setTextColor(0, 0, 0);
    headers.forEach((header, index) => {
      pdf.text(header, startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2, startY + 7);
    });

    let rowY = startY + rowHeight;
    data.forEach((row) => {
      row.forEach((cell, index) => {
        pdf.text(cell, startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2, rowY + 7);
      });
      pdf.line(startX, rowY, startX + colWidths.reduce((a, b) => a + b, 0), rowY);
      rowY += rowHeight;
    });

    // Líneas verticales
    colWidths.reduce((acc, width, index) => {
      if (index > 0) {
        pdf.line(startX + acc, startY, startX + acc, rowY);
      }
      return acc + width;
    }, 0);

    pdf.line(startX, startY, startX, rowY);
    pdf.line(startX + colWidths.reduce((a, b) => a + b, 0), startY, startX + colWidths.reduce((a, b) => a + b, 0), rowY);
    pdf.line(startX, rowY, startX + colWidths.reduce((a, b) => a + b, 0), rowY);

    // Detalles de la Mantención
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Detalles de la Mantención:`, 20, rowY + 15);
    const detailsStartY = rowY + 25;
    const detailsRowHeight = 10;
    const detailsColWidths = [60, 100];
    const detailsHeaders = ["Campo", "Valor"];
    const detailsData = [
      ["Patente", mantencion.patente],
      ["Tipo de Mantención", mantencion.tipoMantencion],
      ["Descripción", mantencion.descripcion],
    ];

    pdf.setFontSize(12);
    pdf.setFillColor(230, 230, 230);
    pdf.rect(startX, detailsStartY, detailsColWidths.reduce((a, b) => a + b, 0), detailsRowHeight, 'F');
    pdf.setTextColor(0, 0, 0);
    detailsHeaders.forEach((header, index) => {
      pdf.text(header, startX + detailsColWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2, detailsStartY + 7);
    });

    let detailsRowY = detailsStartY + detailsRowHeight;
    detailsData.forEach((row) => {
      row.forEach((cell, index) => {
        pdf.text(cell, startX + detailsColWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2, detailsRowY + 7);
      });
      pdf.line(startX, detailsRowY, startX + detailsColWidths.reduce((a, b) => a + b, 0), detailsRowY);
      detailsRowY += detailsRowHeight;
    });

    // Líneas verticales
    detailsColWidths.reduce((acc, width, index) => {
      if (index > 0) {
        pdf.line(startX + acc, detailsStartY, startX + acc, detailsRowY);
      }
      return acc + width;
    }, 0);

    pdf.line(startX, detailsStartY, startX, detailsRowY);
    pdf.line(startX + detailsColWidths.reduce((a, b) => a + b, 0), detailsStartY, startX + detailsColWidths.reduce((a, b) => a + b, 0), detailsRowY);
    pdf.line(startX, detailsRowY, startX + detailsColWidths.reduce((a, b) => a + b, 0), detailsRowY);

    if (download) {
      pdf.save(`${mantencion.id}.pdf`);
    } else {
      const url = pdf.output('bloburl');
      window.open(url);
    }
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
      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <Typography
            variant="h3"
            textAlign="center"
            className={`generarQR_titulo ${isDarkMode ? "dark-mode" : ""}`}
          >
            Historial Mantención
          </Typography>
          <div>
            <Box>
              <TextField
                onChange={filtrarPatente}
                type="text"
                id="Buscar Usuario"
                label="Buscar Patente"
                variant="outlined"
                className={isDarkMode ? "text-field-dark-mode" : ""}
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
        <div className={`table_section ${isDarkMode ? "dark-mode" : ""}`}>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Kilometro de Mantención</TableCell>
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
                        onClick={() => generarPDF(mantencion, false)}
                        variant="contained"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        className={isDarkMode ? "button-dark-mode" : ""}
                        sx={{ marginRight: 1 }}
                      >
                        Visualizar
                      </Button>
                      <Button
                        onClick={() => generarPDF(mantencion, true)}
                        variant="contained"
                        color="secondary"
                        startIcon={<DownloadIcon />}
                        className={isDarkMode ? "button-dark-mode" : ""}
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
