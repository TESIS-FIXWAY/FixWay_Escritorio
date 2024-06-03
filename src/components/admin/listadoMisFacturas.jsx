import React, { useState, useEffect } from "react";
import Admin from "./admin";
import { storage } from "../../firebase";
import { getDownloadURL, getMetadata, ref, listAll } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import "../styles/listadoMisFacturas.css";

const ListadoMisFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [facturaFiltrada, setFacturaFiltrada] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);

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
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Listado de Mis Facturas / Boletas</h1>
          <div>
            <TextField
              type="text"
              placeholder="Buscar Factura"
              label="buscar factura"
              onChange={filtrarFactura}
              size="medium"
            />
          </div>
        </div>
        <div className="table_section">
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
                      <button onClick={() => setSelectedFactura(factura)}>
                        Ver
                      </button>
                      <button onClick={() => downloadPDF(factura.id)}>
                        Descargar
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      {selectedFactura && (
        <div className="preview_pdf_container">
          <div className="preview_header">
            <h2 className="tituloPrevisualizacion">Previsualización</h2>
            <button className="cerrar_btn" onClick={cerrarPrevisualizacion}>
              <FontAwesomeIcon icon="fa-solid fa-times" />
            </button>
          </div>
          <embed
            src={selectedFactura.url}
            type="application/pdf"
            className="preview_pdf"
          />
        </div>
      )}
    </>
  );
};

export default ListadoMisFacturas;
