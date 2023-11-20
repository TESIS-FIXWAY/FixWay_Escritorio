// Componente GenerarListadoMantencion:  
// Este componente React se encarga de generar un listado de mantenciones en formato PDF, 
// permitiendo a los mecánicos descargar información detallada de cada mantención. 

  
// Funciones y Características Principales: 
// Recupera datos de mantenciones desde Firestore al cargar el componente. 
// Ofrece una interfaz que muestra una tabla con información clave de cada mantención. 
// Permite a los mecánicos generar y descargar un listado en formato PDF de una mantención específica. 
// Utiliza la librería jsPDF para la generación del archivo PDF. 

import React, { useState, useEffect } from "react";
import Mecanico from './mecanico';
import { db } from "../../firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from "jspdf";

const GenerarListadoMantencion = () => {
  const [mantenciones, setMantenciones] = useState([]);

  useEffect(() => {
    const fetchMantenciones = async () => {
      try {
        const mantencionesCollection = collection(db, 'mantenciones');
        const snapshot = await getDocs(mantencionesCollection);
        const mantencionesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMantenciones(mantencionesData);
      } catch (error) {
        console.error("Error fetching mantenciones:", error);
      }
    };

    fetchMantenciones();
  }, []);

  const generarPDF = (mantencion) => {
    const pdf = new jsPDF();
  
    const imgData = "../../src/images/LogoSinFoindo.png";
    const imgWidth = 50;
    const imgHeight = 50;
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10;
    const imgY = 10;
    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);
  
    pdf.setFontSize(24);
    pdf.text("Listado de Mantenciones", pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  
    const today = new Date();
    const dateString = today.toLocaleDateString();
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${dateString}`, pdf.internal.pageSize.getWidth() - 50, 20);

    // Example: Add task details
    pdf.text(`Patente: ${mantencion.id}`, 20, 80);
    pdf.text(`Description: ${mantencion.descripcion}`, 20, 90);
    pdf.text(`Tipo de Mantencion: ${mantencion.tipoMantencion}`, 20, 100);
    pdf.text(`Fecha: ${mantencion.fecha}`, 20, 110);

    // Save or open the PDF
    pdf.save("Mantencion.pdf");
  };

  return (
    <>
      <Mecanico />
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Generar Listado Mantencion</h1>
        </div>

        <div className="table_section">
          <table>
            <thead>
              <tr>
                <th>Patente</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenciones.map((mantencion) => (
                <tr key={mantencion.id}>
                  <td>{mantencion.id}</td>
                  <td>{mantencion.descripcion}</td>
                  <td>{mantencion.estado}</td>
                  <td>
                    <button
                      onClick={() => generarPDF(mantencion)}
                      style={{ background: "#E74C3C", height: "45px", marginTop: "10px" }}
                    >
                      <FontAwesomeIcon icon={faFilePdf} />
                      {' '}
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default GenerarListadoMantencion;