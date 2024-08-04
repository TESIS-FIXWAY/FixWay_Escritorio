import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/darkMode";
import Mecanico from "./mecanico";
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

const GenerarListadoMantencion = () => {
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
        : mantenciones.filter((item) => item.id.toLowerCase().includes(texto))
    );
  };

  const generarPDF = (mantencion, download = true) => {
    const pdf = new jsPDF();

    // Function to wrap text within a cell
    const wrapText = (text, maxWidth) => {
      const words = text.split(" ");
      let lines = [];
      let currentLine = "";

      words.forEach((word) => {
        let testLine = currentLine ? `${currentLine} ${word}` : word;
        if (
          (pdf.getStringUnitWidth(testLine) * pdf.internal.getFontSize()) /
            pdf.internal.scaleFactor >
          maxWidth
        ) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      lines.push(currentLine);
      return lines;
    };

    // Logo
    const imgData = "../../images/LogoSinFondo.png";
    const imgWidth = 40;
    const imgHeight = 40;
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10;
    const imgY = 10;
    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);

    // Título
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text(
      "Historial de Mantenciones",
      pdf.internal.pageSize.getWidth() / 2,
      20,
      {
        align: "center",
      }
    );

    // Línea separadora
    const lineSeparatorY = 25;
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(0, 0, 0);
    pdf.line(
      5,
      lineSeparatorY,
      pdf.internal.pageSize.getWidth() - 5,
      lineSeparatorY
    );

    // Fecha
    const today = new Date();
    const dateString = today.toLocaleDateString();
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${dateString}`, pdf.internal.pageSize.getWidth() - 45, 35);

    // Detalles de la Mantención
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Detalles de la Mantención:`, 20, 45);
    pdf.setFontSize(12);
    pdf.setTextColor(50, 50, 50);
    const detailsStartY = 55;
    const detailsRowHeight = 10;
    const detailsColWidths = [80, 80];
    const detailsHeaders = ["Descripción", "Detalles"];
    const detailsData = [
      ["Patente", mantencion.patente || "N/A"],
      ["Tipo de Mantención", mantencion.tipoMantencion || "N/A"],
      ["Descripción", mantencion.descripcion || "N/A"],
      [
        "Kilometro Mantención",
        formatoKilometraje(mantencion.kilometrajeMantencion || 0),
      ],
    ];

    // Detalles de la Mantención - Tabla
    pdf.setFillColor(230, 230, 230);
    pdf.rect(
      20,
      detailsStartY,
      detailsColWidths.reduce((a, b) => a + b, 0),
      detailsRowHeight,
      "F"
    );
    pdf.setTextColor(0, 0, 0);
    detailsHeaders.forEach((header, index) => {
      pdf.text(
        header,
        20 + detailsColWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
        detailsStartY + 7
      );
    });

    let detailsRowY = detailsStartY + detailsRowHeight;
    detailsData.forEach((row) => {
      let cellHeight = detailsRowHeight;

      row.forEach((cell, index) => {
        const lines = wrapText(cell, detailsColWidths[index]);
        lines.forEach((line, lineIndex) => {
          pdf.text(
            line,
            20 +
              detailsColWidths.slice(0, index).reduce((a, b) => a + b, 0) +
              2,
            detailsRowY + 7 + lineIndex * detailsRowHeight
          );
        });
        cellHeight = Math.max(cellHeight, detailsRowHeight * lines.length);
      });

      pdf.line(
        20,
        detailsRowY,
        20 + detailsColWidths.reduce((a, b) => a + b, 0),
        detailsRowY
      ); // Horizontal lines
      detailsRowY += cellHeight;
    });

    // Vertical lines for details
    detailsColWidths.reduce((acc, width) => {
      pdf.line(acc + 20, detailsStartY, acc + 20, detailsRowY);
      return acc + width;
    }, 0);
    pdf.line(
      20 + detailsColWidths.reduce((a, b) => a + b, 0),
      detailsStartY,
      20 + detailsColWidths.reduce((a, b) => a + b, 0),
      detailsRowY
    );

    // Productos Utilizados
    pdf.setFontSize(14);
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Productos Utilizados:`, 20, detailsRowY + 15);
    pdf.setFontSize(12);
    const productos = mantencion.productos || [];

    // Tabla de Productos Utilizados
    const startX = 20;
    const startY = detailsRowY + 25;
    const rowHeight = 10;
    const colWidths = [35, 35, 55, 50];
    const headers = ["Fecha Inicio", "Fecha Término", "Producto", "Precio"];
    const data = productos.map((producto) => [
      formatDate(new Date(mantencion.fecha)),
      formatDate(new Date(mantencion.fechaTerminado)),
      producto.nombreProducto || "Desconocido",
      (producto.precio || 0).toString(),
    ]);

    pdf.setFontSize(12);
    pdf.setFillColor(230, 230, 230);
    pdf.rect(
      startX,
      startY,
      colWidths.reduce((a, b) => a + b, 0),
      rowHeight,
      "F"
    );
    pdf.setTextColor(0, 0, 0);
    headers.forEach((header, index) => {
      pdf.text(
        header,
        startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
        startY + 7
      );
    });

    let rowY = startY + rowHeight;
    data.forEach((row) => {
      let cellHeight = rowHeight;

      row.forEach((cell, index) => {
        const lines = wrapText(cell, colWidths[index]);
        lines.forEach((line, lineIndex) => {
          pdf.text(
            line,
            startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2,
            rowY + 7 + lineIndex * rowHeight
          );
        });
        cellHeight = Math.max(cellHeight, rowHeight * lines.length);
      });

      pdf.line(
        startX,
        rowY,
        startX + colWidths.reduce((a, b) => a + b, 0),
        rowY
      ); // Horizontal lines
      rowY += cellHeight;
    });

    // Vertical lines
    colWidths.reduce((acc, width) => {
      pdf.line(acc, startY, acc, rowY);
      return acc + width;
    }, startX);
    pdf.line(
      startX + colWidths.reduce((a, b) => a + b, 0),
      startY,
      startX + colWidths.reduce((a, b) => a + b, 0),
      rowY
    );

    if (download) {
      pdf.save(`${mantencion.id}.pdf`);
    } else {
      const url = pdf.output("bloburl");
      window.open(url, "PDF", "width=900,height=1200");
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
      <Mecanico />
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

export default GenerarListadoMantencion;
