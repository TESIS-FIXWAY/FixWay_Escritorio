import React, { useState, useEffect } from "react";
import Admin from "./admin";
import { storage } from "../../firebase";
import { getDownloadURL, getMetadata, ref, listAll } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import listadoMisFacturas from '../styles/listadoMisFacturas.css'

const ListadoMisFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const storageRef = ref(storage, 'misFacturas');
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
      } catch (error) {
        console.error('Error al cargar las facturas:', error);
      }
    };
    cargarFacturas();
  }, [refresh]);

  const downloadPDF = async (pdfPath) => {
    try {
      const storageRef = ref(storage, `misFacturas/${pdfPath}`);
      const downloadUrl = await getDownloadURL(storageRef);
      const metadata = await getMetadata(storageRef);
      const fileName = metadata.name;
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.error('Error al descargar el archivo PDF:', error);
    }
  };

  const filtrarFactura = (e) => {
    const texto = e.target.value.toLowerCase();
    const facturasFiltradas = facturas.filter((factura) => {
      const nombreArchivo = factura.id.toLowerCase();
      return nombreArchivo.includes(texto);
    });
    setFacturas(facturasFiltradas);

    if (texto === '') {
      setRefresh((prevRefresh) => !prevRefresh);
    }
  };

  const cerrarPrevisualizacion = () => {
    setSelectedFactura(null);
  };

  return (
    <>
      <Admin/>
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Listado de Mis Facturas</h1>
          <div>
            <FontAwesomeIcon icon="magnifying-glass" />
            <input type="text" placeholder="buscar factura" onChange={filtrarFactura}/>
          </div>
        </div>
        <div className="table_section">
          <table>
            <thead>
              <tr>
                <th scope="col">Nombre Del Archivo</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.id}</td>
                  <td>
                    <button onClick={() => setSelectedFactura(factura)}>Ver</button>
                    <button onClick={() => downloadPDF(factura.id)}>Descargar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedFactura && (
        <div className="preview_pdf_container">
          <div className="preview_header">
            <h2 className="tituloPrevisualizacion">Previsualización</h2>
            <button className="cerrar_btn" onClick={cerrarPrevisualizacion}>Cerrar</button>
          </div>
          <embed src={selectedFactura.url} type="application/pdf" className="preview_pdf" />
        </div>
      )}
    </>
  );
};

export default ListadoMisFacturas;
