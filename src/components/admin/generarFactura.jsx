import React, { useState } from "react";
import Admin from "./admin";
import jsPDF from "jspdf";
import { db } from "../../firebase";
import { 
  collection, 
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { writeBatch, doc } from "firebase/firestore";

const GenerarFactura = () => {
  const [inventario, setInventario] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

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

  const toggleSeleccionProducto = (id) => {
    // Verificar si el producto ya está seleccionado
    const productoIndex = productosSeleccionados.findIndex((producto) => producto.id === id);

    if (productoIndex === -1) {
      // Agregar el producto a la lista de seleccionados
      const productoSeleccionado = inventario.find((producto) => producto.id === id);
      setProductosSeleccionados([...productosSeleccionados, productoSeleccionado]);
    } else {
      // Remover el producto de la lista de seleccionados
      const nuevaLista = [...productosSeleccionados];
      nuevaLista.splice(productoIndex, 1);
      setProductosSeleccionados(nuevaLista);
    }
  };

  const generarFactura = async () => {
    try {
      // Check if no products are selected
      if (productosSeleccionados.length === 0) {
        console.error("No se han seleccionado productos para la factura.");
        return;
      }
  
      // Initialize Firestore batch
      const batch = writeBatch(db);
  
      // Update each selected product in the batch
      productosSeleccionados.forEach((producto) => {
        const productoRef = doc(db, "inventario", producto.id);
        const nuevaCantidad = producto.cantidad || 0;
        updateDoc(productoRef, { cantidad: nuevaCantidad }); // No need for FieldValue.increment here
      });
  
      // Commit the batch update
      await batch.commit();
  
      // Update and download the PDF
      const productosConPrecio = productosSeleccionados.map((producto) => ({
        ...producto,
        precio: producto.costo * 0.19 + producto.costo,
      }));
      generarPDF(productosConPrecio);
    } catch (error) {
      console.error("Error al generar la factura:", error);
    }
  };

  const generarPDF = (productosSeleccionados) => {
    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(26);
    pdf.text("Factura", 10, 10);

    // Table header
    pdf.setFontSize(14);
    pdf.setTextColor(100);
    pdf.text("Nombre del Producto", 10, 30);
    pdf.text("Descripción", 60, 30);
    pdf.text("Costo", 120, 30);
    pdf.text("Cantidad", 160, 30);
    pdf.text("Precio", 200, 30);

    // Table rows
    pdf.setTextColor(0);
    let y = 40;
    productosSeleccionados.forEach((producto) => {
      pdf.text(producto.nombreProducto, 10, y);
      pdf.text(producto.descripcion, 60, y);
      pdf.text(producto.costo.toString(), 120, y);
      pdf.text(producto.cantidad.toString(), 160, y);
      pdf.text(producto.precio.toString(), 200, y);

      y += 10;
    });

    

    // Guardar el PDF
    pdf.save("factura.pdf");
  };

  return (
    <>
      <Admin />
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Generar Factura</h1>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Seleccionar</th>
              <th>Nombre del Producto</th>
              <th>Descripción</th>
              <th>Costo</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => toggleSeleccionProducto(item.id)}
                    checked={productosSeleccionados.some((producto) => producto.id === item.id)}
                  />
                </td>
                <td>{item.nombreProducto}</td>
                <td>{item.descripcion}</td>
                <td>{item.costo}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={productosSeleccionados.find((producto) => producto.id === item.id)?.cantidad || ""}
                    onChange={(e) => {
                      const nuevaCantidad = parseInt(e.target.value, 10) || 0;
                      setProductosSeleccionados((prevProductos) => {
                        const nuevosProductos = prevProductos.map((producto) =>
                          producto.id === item.id ? { ...producto, cantidad: nuevaCantidad } : producto
                        );
                        return nuevosProductos;
                      });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={generarFactura}>Generar Factura</button>
      </div>
    </>
  );
}

export default GenerarFactura;