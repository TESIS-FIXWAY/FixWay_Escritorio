import "../styles/generarQR.css";
import "../styles/darkMode.css";
import React, { useState, useEffect, useContext } from "react";
import Admin from "./admin";
import QRCode from "qrcode.react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Button from "@mui/material/Button";
import { DarkModeContext } from "../../context/darkMode";

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

  const handlePatenteChange = (event) => {
    const patenteId = event.target.value;
    setSelectedPatenteId(patenteId);

    if (patenteId) {
      setQrCodeValue(patenteId);
    } else {
      setQrCodeValue("");
    }
  };

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    const filteredPatentes = patentes.filter((patente) =>
      patente.toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredPatentes(filteredPatentes);
  };

  const handlePatenteInput = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    const filteredPatentes = patentes.filter((patente) =>
      patente.toLowerCase().includes(inputValue.toLowerCase())
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
        {" "}
        <Admin />{" "}
      </header>
      <div lassName={`body_generarQR ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="container">
          <h1 className={`genenrarQR_titulo ${isDarkMode ? "dark-mode" : ""}`}>
            Generador de Códigos QR para Patentes
          </h1>
          <div className={`generarQR_form ${isDarkMode ? "dark-mode" : ""}`}>
            {qrCodeValue && <QRCode id="qr-code-canvas" value={qrCodeValue} />}
            {qrCodeValue && (
              <div>
                <Button
                  variant="outlined"
                  onClick={downloadQRCode}
                  sx={{
                    fontSize: "20px",
                    alignContent: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  Descargar Código QR
                </Button>
              </div>
            )}
            <input
              className={`input_generarQR ${isDarkMode ? "dark-mode" : ""}`}
              type="text"
              value={searchInput}
              onChange={handlePatenteChange}
              placeholder="Buscar patente..."
              list="patentes-list"
              onInput={handlePatenteInput}
            />
            <i class="fa-solid fa-magnifying-glass" />
            <datalist id="patentes-list">
              {filteredPatentes.map((patente) => (
                <option key={patente} value={patente}>
                  {patente}
                </option>
              ))}
            </datalist>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerarQRADmin;
