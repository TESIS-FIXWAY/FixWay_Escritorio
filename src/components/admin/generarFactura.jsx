// Este componente GenerarFactura gestiona la interfaz y la lógica para generar facturas de productos. 
// Permite al usuario seleccionar productos del inventario, ajustar cantidades, aplicar descuentos y elegir el tipo de pago.  
// Utiliza Firebase Firestore para obtener y actualizar el inventario de productos y para almacenar las facturas generadas en la colección 'mifacturas'.  
// También utiliza la librería jsPDF para generar archivos PDF de las facturas.  
// Se integra con FontAwesome para mostrar iconos en la interfaz. 


// Funciones y características principales: 
// Selección de productos del inventario. 
// Ajuste manual de cantidades y eliminación de productos seleccionados. 
// Generación de facturas en formato PDF. 
// Aplicación de descuentos en porcentaje. 
// Elección del tipo de pago (contado o crédito). 
// Visualización y ocultamiento de listas de productos y menú de descuentos. 
// Actualización del inventario después de generar una factura. 
// Búsqueda de productos en tiempo real. 
// Visualización de información detallada en la interfaz. 
// Uso de iconos FontAwesome para mejorar la experiencia del usuario. 

import React, { useState, useEffect } from "react";
import ClienteVista from "./clienteVista";
import Admin from "./admin";
import jsPDF from "jspdf";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  onSnapshot
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
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteApellido, setClienteApellido] = useState("");
  const [clienteRut, setClienteRut] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [showClienteVista, setShowClienteVista] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showAgregarCliente, setShowAgregarCliente] = useState(false);
  const [newName, setNewName] = useState("");
  const [newApellido, setNewApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [id, setId] = useState("");
    
  useEffect(() => {
    const identifyUser = auth.currentUser;
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        const userData = snapshot.data();
        setUserData(userData);
        setNewName(userData.nombre || "");
        setNewApellido(userData.apellido || "");
        setRut(userData.rut || "");
        setEmail(userData.email || "");
        setTelefono(userData.telefono || "");
      });
    }
  }, []);

  const agregarCliente = async () => {
    // ... (código anterior)

    try {
      const nuevoCliente = {
        nombre: clienteNombre,
        apellido: clienteApellido,
        rut: clienteRut,
        email: clienteEmail,
        telefono: clienteTelefono,
      };

      // Agregar el nuevo cliente a la colección "clientes"
      const clientesCollection = collection(db, "clientes");
      const nuevoClienteRef = await addDoc(clientesCollection, nuevoCliente);

      // Actualizar la lista de clientes
      setClientes([...clientes, { id: nuevoClienteRef.id, ...nuevoCliente }]);

      // Limpiar los campos del nuevo cliente
      setClienteNombre("");
      setClienteApellido("");
      setClienteRut("");
      setClienteEmail("");
      setClienteTelefono("");

      // Ocultar la vista de clientes
      toggleClienteVista();
    } catch (error) {
      console.error("Error al agregar el nuevo cliente:", error);
    }
  };

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


    pdf.setFontSize(12);
    const userText = `Nombre Vendedor: ${userData.nombre} ${userData.apellido} `;
    const userX = 160;
    const userY = imgY + imgHeight + 10;
    pdf.text(userText, userX, userY);

    pdf.setFontSize(12);
    const rutText = `Rut Vendedor: ${userData.rut}`;
    const rutX = 170;
    const rutY = imgY + imgHeight + 10;
    pdf.text(rutText, rutX, rutY);
    
    pdf.setFontSize(12);
    const emailText = `Email Vendedor: ${userData.email}`;
    const emailX = 180;
    const emailY =  imgY + imgHeight + 10;
    pdf.text(emailText, emailX, emailY);

    pdf.setFontSize(12);
    const telefonoText = `Telefono Vendedor: ${userData.telefono}`;
    const telefonoX = 190;
    const telefonoY =imgY + imgHeight + 10;
    pdf.text(telefonoText, telefonoX, telefonoY);


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
    if (productosSeleccionados.length === 0) {
      alert("No hay productos seleccionados para generar la factura.");
      return;
    }
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
      setDescuentoMenuValue('');
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

  useEffect(() => {

    const obtenerClientes = async () => {
      try {
        const clientesSnapshot = await getDocs(collection(db, "clientes"));
        const datosClientes = clientesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClientes(datosClientes);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    };

    obtenerClientes();
  }, []);

  const toggleClienteVista = () => {
    setShowClienteVista(!showClienteVista);
  };
  

  const handleSeleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    toggleClienteVista(); // O puedes decidir si ocultar la lista automáticamente o no
  };

  const mostrarListadoClientes = () => {
    if (showClienteVista) {
      return (
        <>
          {/* Mostrar la vista del cliente si showClienteVista es verdadero */}
          {showClienteVista && (
            <ClienteVista
              clientes={clientes}
              setClientes={setClientes}
              setClienteNombre={setClienteNombre}
              setClienteApellido={setClienteApellido}
              setClienteRut={setClienteRut}
              setClienteEmail={setClienteEmail}
              setClienteTelefono={setClienteTelefono}
              toggleClienteVista={toggleClienteVista}
            />
          )}
        </>
      );
    }
  };

  const toggleAgregarCliente = () => {
    setShowAgregarCliente(!showAgregarCliente);
  };

  const mostrarAgregarCliente = () => {
    if (showAgregarCliente) {
      return (
        <div className="fondo_no">
          <div className="editar" style={{ width: "413px" }}>
            <div className="descuento-menu">
              <input
                type="text"
                placeholder="Nombre"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Apellido"
                value={clienteApellido}
                onChange={(e) => setClienteApellido(e.target.value)}
              />
              <input
                type="text"
                placeholder="Rut"
                value={clienteRut}
                onChange={(e) => setClienteRut(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Telefono"
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
              />
              <button onClick={agregarCliente} style={{ background: "#1DC258" }}>
                Agregar Cliente
              </button>
              <button onClick={toggleAgregarCliente} style={{ background: "#E74C3C" }}>
                Cancelar
              </button>
        
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
            <option value="debito">Debito</option>
          </select>

          {showDiscountMenu && mostrarDescuentoMenu()}

          <button style={{ background: "#1DC258",height:"45px", marginTop:"10px" }} onClick={toggleProductList}>
            <FontAwesomeIcon icon="fa-solid fa-list" />
            {showProductList ? "Ocultar Lista" : " Mostrar Lista"} ({productosSeleccionados.length})
          </button>

          {showProductList && mostrarListadoProductos()}

          <button onClick={toggleAgregarCliente} style={{ background: "#1DC258",height:"45px", marginTop:"10px" }}>
            Agregar Cliente
          </button>

          {mostrarAgregarCliente()}

          <button style={{ background: "#1DC258",height:"45px", marginTop:"10px" }} onClick={toggleClienteVista}>
            <FontAwesomeIcon icon="fa-solid fa-users" style={{left: '15px'}} />
            Seleccionar Cliente
          </button>
          {mostrarListadoClientes()}

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