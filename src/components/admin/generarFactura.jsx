import React, { useState, useEffect } from "react";
import Admin from "./admin";
import jsPDF from "jspdf";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  writeBatch,
  getDoc,
} from "firebase/firestore";

const GenerarFactura = () => {
  const [inventario, setInventario] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [showProductList, setShowProductList] = useState(false);








  const generarPDF = (productosSeleccionados, totalSinIVA, iva, totalFinal) => {
    const pdf = new jsPDF();
  
    pdf.setFontSize(24);
    pdf.text("FACTURA", 10, 10);
    pdf.line(10, 15, pdf.internal.pageSize.getWidth() - 10, 15);
  
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    let y = 30;
  
    const columnWidth = 40; // Ancho de las columnas
  
    // Encabezados de la tabla
    pdf.text("Código", 10, y);
    pdf.text("Nombre", 10 + columnWidth, y);
    pdf.text("Descripción", 10 + 2 * columnWidth, y);
    pdf.text("Costo Unitario", 10 + 3 * columnWidth, y);
    pdf.text("Cantidad", 10 + 4 * columnWidth, y);
    pdf.text("Costo Total", 10 + 5 * columnWidth, y);
  
    y += 10;
  
    // Línea separadora de encabezados y datos
    pdf.line(10, y, pdf.internal.pageSize.getWidth() - 10, y);
    y += 5;
  
    // Detalles de los productos
    productosSeleccionados.forEach((producto) => {
      pdf.text(producto.id || "", 10, y);
      pdf.text(producto.nombreProducto || "", 10 + columnWidth, y);
    
      // Dividir la descripción en líneas
      const descripcionLines = pdf.splitTextToSize(
        producto.descripcion || "",
        pdf.internal.pageSize.getWidth() - 20 - 2 * columnWidth
      );
      pdf.text(descripcionLines, 10 + 2 * columnWidth, y);
    
      pdf.text(producto.costo || "", 10 + 3 * columnWidth, y);
      pdf.text(
        producto.cantidad !== undefined ? producto.cantidad.toString() : "",
        10 + 4 * columnWidth,
        y
      );
    
      const costoTotalProducto = (producto.costo || 0) * (producto.cantidad || 1);
      pdf.text(
        `$${costoTotalProducto
          .toFixed(3)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
        10 + 5 * columnWidth,
        y
      );
    
      // Ajustar la posición y para la siguiente línea
      y += descripcionLines.length * 10;
    
      y += 10; // Espacio entre productos
    });
  
    // Línea separadora de datos y totales
    pdf.line(10, y - 5, pdf.internal.pageSize.getWidth() - 10, y - 5);
    y += 10;
  
    // Totales
    pdf.text("Total sin IVA:", 10, y);
    pdf.text(
      `$${totalSinIVA.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      10 + 5 * columnWidth,
      (y += 10)
    );
  
    pdf.text("IVA (19%):", 10, y);
    pdf.text(
      `$${iva.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      10 + 5 * columnWidth,
      (y += 10)
    );
  
    pdf.text("Total final:", 10, y);
    pdf.text(
      `$${totalFinal.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      10 + 5 * columnWidth,
      (y += 10)
    );
  
    pdf.save("factura.pdf");
  };
  











  const totalSinIVA = productosSeleccionados.reduce((total, producto) => {
    const costoTotalProducto = (producto.costo || 0) * (producto.cantidad || 1);
    return total + costoTotalProducto;
  }, 0);

  const iva = totalSinIVA * 0.19;
  const totalFinal = totalSinIVA + iva;

  useEffect(() => {
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
    const productoIndex = productosSeleccionados.findIndex((producto) => producto.id === id);
  
    if (productoIndex === -1) {
      const productoSeleccionado = inventario.find((producto) => producto.id === id);
      setProductosSeleccionados([...productosSeleccionados, { ...productoSeleccionado, cantidad: 0 }]);
      setShowProductList(true); // Mostrar la lista al seleccionar un producto
    } else {
      const nuevaLista = [...productosSeleccionados];
      nuevaLista.splice(productoIndex, 1);
      setProductosSeleccionados(nuevaLista);
      setShowProductList(false); // Ocultar la lista al deseleccionar un producto
    }
  };

  const toggleProductList = () => {
    console.log("Toggle Product List");
    setShowProductList(!showProductList);
  };

  const aumentarCantidad = (id) => {
    setProductosSeleccionados((prevProductos) => {
      return prevProductos.map((producto) => {
        if (producto.id === id) {
          const nuevaCantidad = producto.cantidad + 1;
          const stock = inventario.find((p) => p.id === id).cantidad;
  
          if (nuevaCantidad > stock) {
            alert("No hay suficiente stock disponible.");
            return producto;
          } else {
            return { ...producto, cantidad: nuevaCantidad };
          }
        } else {
          return producto;
        }
      });
    });
  };

  const disminuirCantidad = (id) => {
    setProductosSeleccionados((prevProductos) => {
      return prevProductos.map((producto) => {
        if (producto.id === id) {
          const nuevaCantidad = producto.cantidad - 1;
          if (nuevaCantidad < 0) {
            alert("La cantidad no puede ser menor que cero.");
            return producto;
          } else {
            return { ...producto, cantidad: nuevaCantidad };
          }
        } else {
          return producto;
        }
      });
    });
  };

  const quitarProducto = (id) => {
    const nuevaLista = productosSeleccionados.filter((producto) => producto.id !== id);
    setProductosSeleccionados(nuevaLista);
  };
  
  const actualizarCantidadManual = (id, nuevaCantidad) => {
    const producto = inventario.find((p) => p.id === id);
  
    if (producto && nuevaCantidad > producto.cantidad) {
      alert("No hay suficiente stock disponible");
      return;
    }
  
    setProductosSeleccionados((prevProductos) => {
      return prevProductos.map((p) => (p.id === id ? { ...p, cantidad: nuevaCantidad } : p));
    });
  };

  const buscadorProducto = (e) => {
    const { value } = e.target;
    const inventarioFiltrado = inventario.filter((producto) => {
      return producto.nombreProducto.toLowerCase().includes(value.toLowerCase());
    });
    setInventario(inventarioFiltrado);
    if (value === "") {
      window.location.reload();
    }
  }

  const generarFactura = () => {
    const nuevaFactura = {
      productos: productosSeleccionados.map((producto) => ({
        ...producto,
      })),
    };
    const facturasCollection = collection(db, "mifacturas");

    addDoc(facturasCollection, nuevaFactura)
      .then((nuevaFacturaRef) => {
        productosSeleccionados.forEach((producto) => {
          const productoRef = doc(db, "inventario", producto.id);
  
          if (typeof producto.cantidad === 'number') {
            getDoc(productoRef)
              .then((doc) => {
                const batch = writeBatch(db);
  
                const existingQuantity = doc.data().cantidad;
                const newQuantity = existingQuantity - producto.cantidad;

                batch.update(productoRef, { cantidad: newQuantity });
                
                batch.commit()
                  .then(() => {
                    generarPDF(productosSeleccionados, totalSinIVA, iva, totalFinal);
                    setProductosSeleccionados([]);
                    setShowProductList(false);
                  })
                  .catch((error) => {
                    console.error("Error al actualizar el inventario:", error);
                  });
              })
              .catch((error) => {
                console.error("Error al obtener el documento:", error);
              });
          } else {
            console.error("Invalid cantidad value:", producto.cantidad);
          }
        });
      })
      .catch((error) => {
        console.error("Error al agregar la nueva factura:", error);
      });
  };








  

  





  const mostrarListadoProductos = () => {
    if (showProductList) {
      return (
        <div className="fondo_no">
          <div className="editar" style={{ width: '1000px' }}>
            <p className="p_editar">Productos Seleccionados</p>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre del Producto</th>
                  <th scope="col">Costo</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.nombreProducto}</td>
                    <td>{item.costo}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        style={{ width: '80px' }}
                        value={item.cantidad || 0}
                        onChange={(e) => {
                          const nuevaCantidad = parseInt(e.target.value, 10) || 0;
                          actualizarCantidadManual(item.id, nuevaCantidad);
                        }}
                      />
                    </td>
                    <td>
                      <button onClick={() => aumentarCantidad(item.id)}>+</button>
                      <button onClick={() => disminuirCantidad(item.id)}>-</button>
                      <button onClick={() => quitarProducto(item.id)} style={{ backgroundColor: "red" }}> Quitar </button>                  
                    </td>
                  </tr>
                ))}
              </tbody>
              <button style={{ background: 'green', margin: '60px 0px 0px' }} onClick={toggleProductList}>Ocultar listado de productos</button>
            </table>
          </div>
        </div>
      );
    }
  };





  


  return (
    <>
      <Admin />
      <div className="tabla_listar">
        <div className="table_header">
          <h1>Generar Factura</h1>
          <button
            onClick={generarFactura}
            style={{
              backgroundColor: "#6fa0e8",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#87CEEB")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6fa0e8")}
          >
            Generar Factura
          </button>
          <button style={{ background: "green" }} onClick={toggleProductList}>
            {showProductList ? "Ocultar Lista" : "Mostrar Lista"} ({productosSeleccionados.length})
          </button>
          {showProductList && mostrarListadoProductos()}
          <input type="text" placeholder="Buscar producto" onChange={buscadorProducto} />
        </div>


        <div className='table_section'> 
          <table>
            <thead>
              <tr>
                <th>Seleccionar</th>
                <th>Nombre <br /> del Producto</th>
                <th>Descripción</th>
                <th>Costo</th>
                <th>Cantidad</th>
                <th>Cantidad <br /> Seleccionada</th>
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
                  <td>{item.cantidad}</td>
                  <td>
                  <input
                    type="number"
                    min="0"
                    style={{ width: '80px' }}
                    value={productosSeleccionados.find((producto) => producto.id === item.id)?.cantidad || ""}
                    onChange={(e) => {
                      const nuevaCantidad = parseInt(e.target.value, 10) || 0;
                      actualizarCantidadManual(item.id, nuevaCantidad);
                    }}
                  />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GenerarFactura;