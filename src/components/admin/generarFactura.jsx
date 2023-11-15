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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEyeSlash,
  faFilePdf,
  faList,
 } from '@fortawesome/free-solid-svg-icons';
library.add(
  faFilePdf,
  faList,
  faEyeSlash
);

const GenerarFactura = () => {
  const [inventario, setInventario] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [showProductList, setShowProductList] = useState(false);
  const [tipoPago, setTipoPago] = useState("contado");
  const [showDiscountMenu, setShowDiscountMenu] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [descuentoMenuValue, setDescuentoMenuValue] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);


  const generarPDF = (productosSeleccionados, totalSinIVA, descuentoAplicado) => {
    const pdf = new jsPDF();
  
    const imgData = "../../src/images/LogoSinFoindo.png";
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
    const tipoPagoY = imgY + imgHeight + 5; 
    pdf.text(tipoPagoText, tipoPagoX, tipoPagoY);
  
    // Encabezado
  
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
  
      pdf.text(costoNumerico.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), tableX + 120, currentY - 10);
  
      const totalProducto = producto.cantidad * costoNumerico;
      pdf.text(totalProducto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), tableX + 160, currentY - 10);
  
      neto += totalProducto;
  
      currentY += h + rowSpacing;
    });
  
    pdf.text(`Neto: ${neto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 10);
  
    const iva = neto * 0.19;
    pdf.text(`Total IVA (19%): ${iva.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 20);
  
    // const totalFinal = neto + iva - descuentoAplicado;
    const totalFinal = neto + iva; 
    pdf.text(`Total Final: ${totalFinal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 30);

    const descuento = parseInt(descuentoMenuValue, 10);
    // const descuento = (totalSinIVA * descuentoMenuValue) / 100;
    console.log(`Descuento aplicado: ${descuento}%`);

    // Calcula el descuento en cantidad
    const descuentoCantidad = (descuento / 100) * totalSinIVA;

    // Calcula el descuento en el total final
    const descuentoTotalFinal = (descuento / 100) * (totalFinal);

    // Actualiza el estado del descuento aplicado
    setDescuentoAplicado(descuentoTotalFinal);

    // Oculta el menú de descuentos después de aplicar el descuento
    setShowDiscountMenu(false);
    
    pdf.text(`Descuento: ${descuentoTotalFinal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 40);
    pdf.text(`Total Final con Descuento: ${(totalFinal - descuentoTotalFinal).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 50);
    
    const tableHeight = Math.max(30, productosHeight + 20);
    pdf.line(10, lineY, pdf.internal.pageSize.getWidth() - 10, lineY);
    pdf.save("factura.pdf");
  };



  const toggleDiscountMenu = () => {
    setShowDiscountMenu(!showDiscountMenu);
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
      setProductosSeleccionados([...productosSeleccionados, { ...productoSeleccionado, cantidad: 1 }]); // Set initial quantity to 1
      setShowProductList(false);
    } else {
      const nuevaLista = [...productosSeleccionados];
      nuevaLista.splice(productoIndex, 1);
      setProductosSeleccionados(nuevaLista);
      setShowProductList(false);
    }
  };

  const toggleProductList = () => {
    console.log("Toggle Product List");
    setShowProductList(!showProductList);
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
  };

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

          // Actualizar la cantidad en el inventario
          batch.update(productoRef, { cantidad: newQuantity });
        } else {
          console.error("Invalid cantidad value:", producto.cantidad);
        }
      }

      // Agregar la nueva factura
      const nuevaFacturaRef = await addDoc(facturasCollection, nuevaFactura);

      await batch.commit();

      // Generar el PDF después de procesar todos los productos
      generarPDF(productosSeleccionados, totalSinIVA, iva, totalFinal, descuentoAplicado);

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

  const handleDescuentoChange = (e) => {
    const { value } = e.target;
    if (/^[1-9][0-9]?$|^100$/.test(value) || value === '') {
      setDescuentoMenuValue(value);
    }
  };
  
  const aplicarDescuento = () => {
    const descuento = parseInt(descuentoMenuValue, 10);
    console.log(`Descuento aplicado: ${descuento}%`);
    // Puedes agregar lógica adicional aquí para aplicar el descuento a tu factura.
    // Por ejemplo, podrías ajustar el cálculo del total final.

    // Calcula el descuento en cantidad
    const descuentoCantidad = (descuento / 100) * totalSinIVA;
  
    // Calcula el descuento en el total final
    const descuentoTotalFinal = (descuento / 100) * (totalSinIVA + (totalSinIVA * 0.19));

    // Actualiza el estado del descuento aplicado
    setDescuentoAplicado(descuentoTotalFinal);

    // Oculta el menú de descuentos después de aplicar el descuento
    setShowDiscountMenu(false);
  };
  
  const cancelarDescuento = () => {
    // Puedes agregar lógica adicional aquí si es necesario
    // En este ejemplo, simplemente se oculta el menú de descuentos
    setShowDiscountMenu(false);
  };
  
  const mostrarDescuentoMenu = () => {
    if (showDiscountMenu) {
      return (
        <div className="fondo_no">
          <div className="editar" style={{ width: '413px' }}>
            <div className="descuento-menu">
              <input
                type="text"
                placeholder="Descuento (%)"
                value={descuentoMenuValue}
                onChange={handleDescuentoChange}
              />
              <button onClick={aplicarDescuento} style={{ background: "#1DC258" }}> Aplicar Descuento</button>
              <button onClick={cancelarDescuento} style={{background: "#E74C3C"}}>Cancelar Descuento</button>
            </div>
          </div>
        </div>
      );
    }
  };

  const mostrarListadoProductos = () => {
    if (showProductList) {
      return (
        <div className="fondo_no">
          <div className="editar" style={{ width: '1100px' }}>
            <p className="p_editar">Productos Seleccionados</p>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Establece la altura máxima y agrega scroll si es necesario */}
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
                        <button onClick={() => quitarProducto(item.id)} style={{ backgroundColor: "red" }}>
                          <FontAwesomeIcon icon="fa-solid fa-xmark" /> Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <tfoot>
              <tr>
                <td colSpan="5">
                  <button style={{ background: '#E74C3C', marginRight: '10px' }} onClick={() => setProductosSeleccionados([])}>
                  <FontAwesomeIcon icon="fa-solid fa-trash" /> Vaciar Lista
                  </button>
                  <button style={{ background: '#1DC258' }} onClick={toggleProductList}>
                  <FontAwesomeIcon icon="fa-solid fa-eye-slash" /> Ocultar listado de productos
                  </button>
                </td>
              </tr>
            </tfoot>
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
            onClick={() => generarFactura(productosSeleccionados)}
            style={{
              backgroundColor: "#6fa0e8",height:"45px", marginTop:"10px"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#87CEEB")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6fa0e8")}>
            <FontAwesomeIcon icon="fa-solid fa-file-pdf" /> Generar Factura
          </button>

          <button onClick={toggleDiscountMenu} style={{background: "#E74C3C",height:"45px", marginTop:"10px"}}>Añadir Descuento %</button>

          <select
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
            style={{ width: '100px',height:"45px", marginTop:"10px" }}
          >
            <option value="contado">Contado</option>
            <option value="credito">Crédito</option>
          </select>

          {showDiscountMenu && mostrarDescuentoMenu()}

          <button style={{ background: "#1DC258",height:"45px", marginTop:"10px"}} onClick={toggleProductList}>
            <FontAwesomeIcon icon="fa-solid fa-list" />
            {showProductList ? "Ocultar Lista" : " Mostrar Lista"} ({productosSeleccionados.length})
          </button>

          {showProductList && mostrarListadoProductos()}
          
          <input style={{height:"45px", marginTop:"10px"}}type="text" placeholder="Buscar producto" onChange={buscadorProducto} /> 
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