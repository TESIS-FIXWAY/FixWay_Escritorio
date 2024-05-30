import "../styles/generarQR.css";
import React, { useState, useEffect } from "react";
import Admin from "./admin";
import QRCode from "qrcode.react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Button from "@mui/material/Button";

const GenerarQRADmin = () => {
  const [patentes, setPatentes] = useState([]);
  const [filteredPatentes, setFilteredPatentes] = useState([]);
  const [selectedPatenteId, setSelectedPatenteId] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [searchInput, setSearchInput] = useState("");

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
      <div className="container">
        <div className="generador_qr_titulo">
          <h1>Generador de Códigos QR para Patentes</h1>
        </div>
        <div>
          {qrCodeValue && <QRCode id="qr-code-canvas" value={qrCodeValue} />}
          {qrCodeValue && (
            <div>
              <Button variant="outlined" onClick={downloadQRCode}>
                Descargar Código QR
              </Button>
            </div>
          )}
          <input
            className="input_qr"
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
    </>
  );
};

export default GenerarQRADmin;
