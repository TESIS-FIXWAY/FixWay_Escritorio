import "../styles/generarQR.css";
import "../styles/darkMode.css";
import React, { useState, useEffect, useContext } from "react";
import Mecanico from "./mecanico";
import QRCode from "qrcode.react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  TextField,
  Button,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";
import { DarkModeContext } from "../../context/darkMode";
import { Download } from "@mui/icons-material";

const GenerarQRADmin = () => {
  const [patentes, setPatentes] = useState([]);
  const [filteredPatentes, setFilteredPatentes] = useState([]);
  const [selectedPatenteId, setSelectedPatenteId] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = collection(db, "historialMantencion");

      try {
        const querySnapshot = await getDocs(dataRef);
        const nuevasPatentes = querySnapshot.docs.map((doc) => doc.id);

        setPatentes(nuevasPatentes);
        setFilteredPatentes(nuevasPatentes);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const handlePatenteChange = (event, value) => {
    const patenteId = value;
    setSelectedPatenteId(patenteId);

    if (patenteId) {
      setQrCodeValue(patenteId);
    } else {
      setQrCodeValue("");
    }
  };

  const handleSearchInputChange = (event, value) => {
    setSearchInput(value);

    const filteredPatentes = patentes.filter((patente) =>
      patente.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPatentes(filteredPatentes);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas");
    const imageDataUrl = canvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = imageDataUrl;
    downloadLink.download = `codigo-qr-${selectedPatenteId}.png`;
    downloadLink.click();
  };

  return (
    <>
      <header>
        <Mecanico />
      </header>
      <div className={`body_generarQR ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="formulario_content_generarQR">
          <Box textAlign="center" mt={4} className="formulario_content">
            <Typography
              variant="h3"
              textAlign="center"
              className={`generarQR_titulo ${isDarkMode ? "dark-mode" : ""}`}
            >
              Generador de Códigos QR para Patentes
            </Typography>
            <div
              className={`formulario_form_generarQR ${
                isDarkMode ? "dark-mode" : ""
              }`}
            >
              <Box mt={4} textAlign="center" justifyContent="center">
                {qrCodeValue && (
                  <QRCode id="qr-code-canvas" value={qrCodeValue} />
                )}
                {qrCodeValue && (
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      onClick={downloadQRCode}
                      startIcon={<Download />}
                      sx={{ fontSize: "20px", marginBottom: "20px" }}
                    >
                      Descargar Código QR
                    </Button>
                  </Box>
                )}
                <Autocomplete
                  options={filteredPatentes}
                  getOptionLabel={(option) => option}
                  value={selectedPatenteId}
                  onChange={handlePatenteChange}
                  inputValue={searchInput}
                  onInputChange={handleSearchInputChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar patente..."
                      variant="outlined"
                      className={`input_generarQR ${
                        isDarkMode ? "dark-mode" : ""
                      }`}
                    />
                  )}
                  sx={{ width: "300px", margin: "0 auto" }}
                />
              </Box>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default GenerarQRADmin;
