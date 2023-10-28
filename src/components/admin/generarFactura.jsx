import React, { useState } from "react";
import Admin from "./admin";
import jsPDF from "jspdf";
import { db } from "../../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  doc,
  addDoc,
  getDocs
} from "firebase/firestore";

const GenerarFactura  = () => {
  const [miFactura, setMiFactura] = useState([]);
  const [inventario, setInventario] = useState([]);

  React.useEffect(() => {
    const obtenerInventario = async () => {
      try {
        const inventarioSnapshot = await getDocs(collection(db, "inventario"));
        const datosInventario = inventarioSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setInventario(datosInventario);
      } catch (error) {
        console.error("Error al obtener el inventario:", error);
      }
    };

    obtenerInventario();
  }, []);

  // const generarFactura = async () => {
  //   try {
  //     const primerItemInventario = inventario[0];

  //     const nuevaFactura = {
  //       nombreProducto: primerItemInventario.nombreProducto,
  //       descripcion: primerItemInventario.descripcion,
  //       precio: primerItemInventario.precio,
  //       costo: primerItemInventario.costo,
  //     };

  //     // Almacenar la factura en Firebase
  //     const facturaRef = await addDoc(collection(db, "facturas"), nuevaFactura);

  //     // Actualizar el estado con la nueva factura
  //     setMiFactura((prevFacturas) => [...prevFacturas, { id: facturaRef.id, ...nuevaFactura }]);

  //     // Generar y descargar el PDF
  //     generarPDF(nuevaFactura);
  //   } catch (error) {
  //     console.error("Error al generar la factura:", error);
  //   }
  // };

  const generarFactura = async () => {
    try {
      // Check if the inventory is empty
      if (inventario.length === 0) {
        console.error("El inventario está vacío. No se puede generar la factura.");
        return;
      }
  
      const primerItemInventario = inventario[0];
  
      const nuevaFactura = {
        nombreProducto: primerItemInventario.nombreProducto,
        descripcion: primerItemInventario.descripcion,
        precio: primerItemInventario.precio,
        costo: primerItemInventario.costo,
      };
  
      // Almacenar la factura en Firebase
      const facturaRef = await addDoc(collection(db, "facturas"), nuevaFactura);
  
      // Actualizar el estado con la nueva factura
      setMiFactura((prevFacturas) => [...prevFacturas, { id: facturaRef.id, ...nuevaFactura }]);
  
      // Generar y descargar el PDF
      generarPDF(nuevaFactura);
    } catch (error) {
      console.error("Error al generar la factura:", error);
    }
  };

  const generarPDF = (factura) => {
    const pdf = new jsPDF();
    pdf.text("Detalles de la factura:", 10, 10);
    pdf.text(`Nombre del Producto: ${factura.nombreProducto}`, 10, 20);
    pdf.text(`Descripción: ${factura.descripcion}`, 10, 30);
    // pdf.text(`Precio: ${factura.precio}`, 10, 40);
    pdf.text(`Costo: ${factura.costo}`, 10, 50);
    pdf.save("factura.pdf");
  };

  return(
    <>
      <Admin />
      <div className="container">
        <h1>Generar Factura</h1>
        <br />
        <br />
        <br />
        <br />
        <br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Costo</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((item) => (
              <tr key={item.id}>
                <td>{item.nombreProducto}</td>
                <td>{item.descripcion}</td>
                <td>{item.precio}</td>
                <td>{item.costo}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={generarFactura}>Generar Factura</button>
      </div>
    </>
  )
}

export default GenerarFactura;