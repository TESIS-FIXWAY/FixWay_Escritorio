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
  const [tipoPago, setTipoPago] = useState("contado");









  const generarPDF = (productosSeleccionados, totalSinIVA) => {
    const pdf = new jsPDF();
  
    const imgData =  "../../src/images/LogoSinFoindo.png"; 
    const imgWidth = 50; 
    const imgHeight = 50; 
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10; 
    const imgY = 10; 
    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);
  
    pdf.setFontSize(24);
    pdf.text("FACTURA", pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    
    const today = new Date();
    const dateString = today.toLocaleDateString();
    pdf.setFontSize(12);
    pdf.text(`Fecha: ${dateString}`, pdf.internal.pageSize.getWidth() - 50, 20);

    pdf.setFontSize(12);
    const tipoPagoText = `Tipo de Pago: ${tipoPago}`;
    const tipoPagoX = 160; 
    const tipoPagoY = 55; + imgHeight + 5; 
    pdf.text(tipoPagoText, tipoPagoX, tipoPagoY);


    //fin del encabezado

    const lineY = tipoPagoY + 15; 
    pdf.line(10, lineY, pdf.internal.pageSize.getWidth() - 10, lineY);

    const fontSize = 10;
    pdf.setFontSize(fontSize);

    const headers = ["Producto", "Cantidad", "Descripción", "Precio U.", "Total", "Total Producto"];
    const tableX = 15; 
    const tableY = lineY + 10; 

    headers.forEach((header, index) => {
      pdf.text(header, tableX + index * 40, tableY);
    });

    const rowSpacing = 3;
    const productosHeight = productosSeleccionados.reduce(
      (total, producto) => total + pdf.getTextDimensions(producto.descripcion).h + rowSpacing,
      0
    );

    // Inicializar variable para el neto
    let neto = 0;

    let currentY = tableY + 10; 
    productosSeleccionados.forEach((producto) => {
      const { h } = pdf.getTextDimensions(producto.descripcion);
      const lines = pdf.splitTextToSize(producto.descripcion, 50);

      lines.forEach((line, i) => {
        pdf.text(line, tableX + 60, currentY);
        currentY += h + rowSpacing;
      });

      pdf.text(producto.nombreProducto, tableX, currentY - 10);
      pdf.text(producto.cantidad.toString(), tableX + 45, currentY - 10);

      const costoNumerico = parseFloat(producto.costo.replace(/\./g, '').replace(',', '.'));

      pdf.text(costoNumerico.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), tableX + 120, currentY - 10);

      const totalProducto = producto.cantidad * costoNumerico;
      pdf.text(totalProducto.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), tableX + 160, currentY - 10);

      neto += totalProducto; 

      currentY += h + rowSpacing;
    });


    pdf.text(`Neto: ${neto.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 10);

    const iva = neto * 0.19;
    pdf.text(`Total IVA (19%): ${iva.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 20);

    const totalFinal = neto + iva;
    pdf.text(`Total Final: ${totalFinal.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 30);


    const tableHeight = Math.max(30, productosHeight + 20); 
    pdf.line(10, lineY, pdf.internal.pageSize.getWidth() - 10, lineY);
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

  const generarFactura = async () => {
    try {
      const nuevaFactura = {
        productos: productosSeleccionados.map((producto) => ({
          ...producto,
        })),
        tipoPago: tipoPago,
      };
      const facturasCollection = collection(db, "mifacturas");
      const batch = writeBatch(db);

      // Procesar cada producto
      for (const producto of productosSeleccionados) {
        const productoRef = doc(db, "inventario", producto.id);

        if (typeof producto.cantidad === 'number') {
          const docSnapshot = await getDoc(productoRef);
          const existingQuantity = docSnapshot.data().cantidad;
          const newQuantity = existingQuantity - producto.cantidad;

          batch.update(productoRef, { cantidad: newQuantity });
        } else {
          console.error("Invalid cantidad value:", producto.cantidad);
        }
      }

      // Agregar la nueva factura
      const nuevaFacturaRef = await addDoc(facturasCollection, nuevaFactura);

      // Cometer la transacción
      await batch.commit();

      // Generar el PDF después de procesar todos los productos
      generarPDF(productosSeleccionados, totalSinIVA, iva, totalFinal);

      // Limpiar los productos seleccionados y ocultar la lista
      setProductosSeleccionados([]);
      setShowProductList(false);
    } catch (error) {
      console.error("Error al generar la factura:", error);
    }
  


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
          <div className="editar" style={{ width: '1100px' }}>
            <p className="p_editar">Productos Seleccionados</p>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre del Producto</th>
                  <th scope="col">Costo</th>
                  <th scope="col">Tipo <br /> de pago</th>
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
                      <select
                        value={tipoPago}
                        onChange={(e) => setTipoPago(e.target.value)}
                        style={{ marginLeft: "10px" }}
                      >
                        <option value="contado">Contado</option>
                        <option value="credito">Crédito</option>
                      </select>
                    </td>
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