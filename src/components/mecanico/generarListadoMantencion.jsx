import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/darkMode";
import { db } from "../../dataBase/firebase";
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
  const [patentesUnicas, setPatentesUnicas] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchMantenciones = async () => {
      try {
        const mantencionesCollection = collection(db, "mantenciones");
        const snapshot = await getDocs(mantencionesCollection);
        const mantencionesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMantenciones(mantencionesData);
        setPatentesUnicas(obtenerPatentesUnicas(mantencionesData));
      } catch (error) {
        console.error("Error fetching mantenciones:", error);
      }
    };

    fetchMantenciones();
  }, []);

  // Función para obtener las patentes únicas
  const obtenerPatentesUnicas = (mantenciones) => {
    const patentesSet = new Set();
    return mantenciones.filter((mantencion) => {
      if (!patentesSet.has(mantencion.patente)) {
        patentesSet.add(mantencion.patente);
        return true;
      }
      return false;
    });
  };

  // Función para filtrar por patente
  const filtrarPatente = (e) => {
    const texto = e.target.value.toLowerCase();
    const mantencionesFiltradas = mantenciones.filter((item) =>
      item.patente.toLowerCase().includes(texto)
    );
    setPatentesUnicas(obtenerPatentesUnicas(mantencionesFiltradas));
  };

  // Función para generar PDF con todas las mantenciones de una patente
  const generarPDF = (patente, action) => {
    const pdf = new jsPDF();
    const mantencionesPorPatente = mantenciones.filter(
      (mantencion) => mantencion.patente === patente
    );

    // Función para ajustar texto largo
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
      `Mantenciones para patente: ${patente}`,
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

    // Tabla de Mantenciones
    let currentY = 45;
    const rowHeight = 10;

    mantencionesPorPatente.forEach((mantencion, index) => {
      if (index > 0 && currentY > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text(`Patente: ${mantencion.patente || "N/A"}`, 20, currentY);
      currentY += rowHeight;

      pdf.setFontSize(12);
      pdf.setTextColor(50, 50, 50);
      pdf.text(
        `Fecha: ${formatDate(new Date(mantencion.fecha))}`,
        20,
        currentY
      );
      currentY += rowHeight;

      pdf.text(
        `Tipo de Mantención: ${mantencion.tipoMantencion || "N/A"}`,
        20,
        currentY
      );
      currentY += rowHeight;

      pdf.text(`Descripción: ${mantencion.descripcion || "N/A"}`, 20, currentY);
      currentY += rowHeight;

      pdf.text(
        `Kilometraje: ${formatoKilometraje(
          mantencion.kilometrajeMantencion || 0
        )}`,
        20,
        currentY
      );
      currentY += rowHeight + 5;

      // Línea separadora entre mantenciones
      pdf.setDrawColor(0, 0, 0);
      pdf.line(5, currentY, pdf.internal.pageSize.getWidth() - 5, currentY);
      currentY += rowHeight;
    });

    // Acción de visualización o descarga
    if (action === "visualizar") {
      pdf.output("dataurlnewwindow"); // Abrir en una nueva ventana
    } else if (action === "descargar") {
      pdf.save(`mantenciones_${patente}.pdf`); // Descargar
    }
  };

  const formatoKilometraje = (kilometraje) => {
    return new Intl.NumberFormat().format(kilometraje);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
        borderRadius: 2,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box mb={2}>
        <TextField
          label="Filtrar por Patente"
          variant="outlined"
          size="small"
          fullWidth
          onChange={filtrarPatente}
          sx={{
            mb: 2,
            backgroundColor: isDarkMode ? "#333" : "#fff",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDarkMode ? "#555" : "#ccc",
              },
            },
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patentesUnicas.map((mantencion) => (
              <TableRow key={mantencion.id}>
                <TableCell>{mantencion.patente}</TableCell>
                <TableCell>{formatDate(new Date(mantencion.fecha))}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => generarPDF(mantencion.patente, "visualizar")}
                    sx={{ mr: 1 }}
                  >
                    Visualizar PDF
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    startIcon={<DownloadIcon />}
                    onClick={() => generarPDF(mantencion.patente, "descargar")}
                  >
                    Descargar PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GenerarListadoMantencion;
