import "../styles/listadoMisFacturas.css";
import "../styles/darkMode.css";
import React, { useState, useEffect, useContext } from "react";
import Admin from "../admin";
import { DarkModeContext } from "../../../context/darkMode";
import { storage } from "../../../firebase";
import { getDownloadURL, getMetadata, ref, listAll } from "firebase/storage";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import CloseIcon from "@mui/icons-material/Close";

const ListadoMisFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [facturaFiltrada, setFacturaFiltrada] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const storageRef = ref(storage, "misFacturas");
        const listResult = await listAll(storageRef);
        const facturasData = await Promise.all(
          listResult.items.map(async (item) => {
            const downloadUrl = await getDownloadURL(item);
            return {
              id: item.name,
              url: downloadUrl,
            };
          })
        );
        setFacturas(facturasData);
        setFacturaFiltrada(facturasData);
      } catch (error) {
        console.error("Error al cargar las facturas:", error);
      }
    };
    cargarFacturas();
  }, []);

  const downloadPDF = async (pdfPath) => {
    try {
      const storageRef = ref(storage, `misFacturas/${pdfPath}`);
      const downloadUrl = await getDownloadURL(storageRef);
      const metadata = await getMetadata(storageRef);
      const fileName = metadata.name;
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.error("Error al descargar el archivo PDF:", error);
    }
  };

  const filtrarFactura = (e) => {
    const texto = e.target.value.toLowerCase();
    if (texto === "") {
      setFacturaFiltrada(facturas);
    } else {
      const facturasFiltradas = facturas.filter((factura) => {
        const nombreArchivo = factura.id.toLowerCase();
        return nombreArchivo.includes(texto);
      });
      setFacturaFiltrada(facturasFiltradas);
    }
  };

  const cerrarPrevisualizacion = () => {
    setSelectedFactura(null);
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
            Listado de Ventas
          </Typography>
          <div>
            <TextField
              type="text"
              placeholder="Buscar Factura"
              label="buscar factura"
              onChange={filtrarFactura}
              size="medium"
              className={isDarkMode ? "text-field-dark-mode" : ""}
            />
          </div>
        </div>
        <div className={`table_section ${isDarkMode ? "dark-mode" : ""}`}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre Del Archivo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facturaFiltrada.map((factura) => (
                  <TableRow key={factura.id}>
                    <TableCell>{factura.id}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedFactura(factura)}
                        className={isDarkMode ? "button-dark-mode" : ""}
                        variant="outlined"
                        sx={{ color: "white" }}
                        startIcon={<PreviewIcon />}
                      >
                        Ver
                      </Button>
                      <Button
                        onClick={() => downloadPDF(factura.id)}
                        className={isDarkMode ? "button-dark-mode" : ""}
                        variant="outlined"
                        sx={{ color: "white", left: "12px" }}
                        startIcon={<DownloadIcon />}
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
      {selectedFactura && (
        <div
          className={`preview_pdf_container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <div className={`preview_header ${isDarkMode ? "dark-mode" : ""}`}>
            <h2 className="tituloPrevisualizacion">Previsualización</h2>
            <Button
              className={`cerrar_btn ${isDarkMode ? "button-dark-mode" : ""}`}
              onClick={cerrarPrevisualizacion}
              startIcon={<CloseIcon />}
            ></Button>
          </div>
          <embed
            src={selectedFactura.url}
            type="application/pdf"
            className={`preview_pdf ${isDarkMode ? "dark-mode" : ""}`}
          />
        </div>
      )}
    </>
  );
};

export default ListadoMisFacturas;
