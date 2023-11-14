import React, { useState, useEffect } from 'react';
import Mecanico from './mecanico';
import QRCode from 'qrcode.react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const App = () => {
  const [patentes, setPatentes] = useState([]);
  const [selectedPatenteId, setSelectedPatenteId] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = collection(db, 'mantenciones');

      try {
        const querySnapshot = await getDocs(dataRef);
        const nuevasPatentes = querySnapshot.docs.map((doc) => doc.id);

        setPatentes(nuevasPatentes);
      } catch (error) {
        console.error('Error fetching data:', error.message);
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
      setQrCodeValue('');
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    const imageDataUrl = canvas.toDataURL('image/png');

    const downloadLink = document.createElement('a');
    downloadLink.href = imageDataUrl;
    downloadLink.download = `codigo-qr-${selectedPatenteId}.png`;
    downloadLink.click();
  };

  const printQRCode = () => {
    const qrCodeCanvas = document.getElementById('qr-code-canvas');
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
      <html>
        <head>
          <title>Hans Motors QR</title>
        </head>
        <body>
          <img src="${qrCodeCanvas.toDataURL('image/png')}" />
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  }

  return (
    <>
      <Mecanico />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div>
          <h1>Generador de Códigos QR para Patentes</h1>
          <select value={selectedPatenteId} onChange={handlePatenteChange}>
            <option value="" disabled>
              Selecciona una patente
            </option>
            {patentes.map((patente) => (
              <option key={patente} value={patente}>
                {patente}
              </option>
            ))}
          </select>
          {qrCodeValue && <QRCode id="qr-code-canvas" value={qrCodeValue} />}
          {qrCodeValue && (
            <div>
              <button onClick={downloadQRCode}>Descargar código QR</button>
              <button onClick={printQRCode}>Imprimir código QR</button>
            </div>
          )}
        </div>
    </>
  );
};

export default App;
