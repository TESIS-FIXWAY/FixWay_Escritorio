import React, { useState } from "react";
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
    const productoIndex = productosSeleccionados.findIndex((producto) => producto.id === id);

    if (productoIndex === -1) {
      const productoSeleccionado = inventario.find((producto) => producto.id === id);
      setProductosSeleccionados([...productosSeleccionados, { ...productoSeleccionado, cantidad: 0 }]);
      setShowProductList(true); // Mostrar la lista al seleccionar un producto
    } else {
      const nuevaLista = [...productosSeleccionados];
      nuevaLista.splice(productoIndex, 1);
      setProductosSeleccionados(nuevaLista);
    }
  };

  const toggleProductList = () => {
    setShowProductList(false);
  };

  const aumentarCantidad = (id) => {
    setProductosSeleccionados((prevProductos) => {
      return prevProductos.map((producto) =>
        producto.id === id ? { ...producto, cantidad: producto.cantidad + 1 } : producto
      );
    });
  };

  const disminuirCantidad = (id) => {
    setProductosSeleccionados((prevProductos) => {
      return prevProductos.map((producto) =>
        producto.id === id && producto.cantidad > 0 ? { ...producto, cantidad: producto.cantidad - 1 } : producto
      );
    });
  };

  const actualizarCantidadManual = (id, nuevaCantidad) => {
    setProductosSeleccionados((prevProductos) => {
      return prevProductos.map((producto) => (producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto));
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
                    generarPDF(productosSeleccionados);
                    setProductosSeleccionados([]);
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

  const generarPDF = (productosSeleccionados) => {
    const pdf = new jsPDF();
  
    pdf.setFontSize(24);
    pdf.text("FACTURA", 10, 10);
    pdf.line(10, 15, pdf.internal.pageSize.getWidth() - 10, 15);
  
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    let y = 30;
  
    productosSeleccionados.forEach((producto) => {
      pdf.text("Nombre del producto:", 10, y);
      pdf.text(producto.nombreProducto || "", 80, y);
      y += 10;
  
      pdf.text("Descripción:", 10, y);
      pdf.text(producto.descripcion || "", 80, y);
      y += 10;
  
      pdf.text("Costo unitario:", 10, y);
      pdf.text(producto.costo || "", 80, y);
      y += 10;
  
      pdf.text("Cantidad:", 10, y);
      pdf.text(producto.cantidad !== undefined ? producto.cantidad.toString() : "", 80, y);
      y += 10;
  
      const costoTotalProducto = (producto.costo || 0) * (producto.cantidad || 1);
      pdf.text("Costo total:", 10, y);
      pdf.text(`$${costoTotalProducto.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, 80, y);
      y += 10;
  
      pdf.line(10, y - 5, pdf.internal.pageSize.getWidth() - 10, y - 5);
      y += 10; 
    });
  
    // Calcular el total a pagar sin IVA
    const totalSinIVA = productosSeleccionados.reduce((total, producto) => {
      const costoTotalProducto = (producto.costo || 0) * (producto.cantidad || 1);
      return total + costoTotalProducto;
    }, 0);

    // Calcular el IVA (19% del total sin IVA)
    const iva = totalSinIVA * 0.19;

    // Calcular el nuevo total final (total sin IVA + IVA)
    const totalFinal = totalSinIVA + iva;

    pdf.text("Total sin IVA:", 10, y);
    pdf.text(`$${totalSinIVA.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, 80, y += 10);

    pdf.text("IVA (19%):", 10, y);
    pdf.text(`$${iva.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, 80, y += 10);

    pdf.text("Total final:", 10, y);
    pdf.text(`$${totalFinal.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`, 80, y += 10);
  
    pdf.save("factura.pdf");
  };

  const toggleProductListView = () => {
    setShowProductList(!showProductList);
  };



  const mostrarListadoProductos = () => {
    if (showProductList) {
      return (
        <div className="fondo_no">
          <div className="editar" style={{ width: '900px' }}>
            <p className="p_editar">Productos Seleccionados</p>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Costo</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nombreProducto}</td>
                    <td>{item.costo}</td>
                    <td>{item.cantidad}</td>
                    <td>
                      <button onClick={() => aumentarCantidad(item.id)}>+</button>
                      <button onClick={() => disminuirCantidad(item.id)}>-</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <button style={{ background: 'green', margin: '60px 0px 0px' }} onClick={toggleProductListView}>Ocultar listado de productos</button>
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
          <button style={{ background: "green" }} onClick={toggleProductListView}>
            {showProductList ? "Ocultar Lista" : "Mostrar Lista"}
          </button>
          {showProductList && mostrarListadoProductos()}
          <input type="text" placeholder="Buscar producto" onChange={buscadorProducto} />
        </div>
        <table className="table table-striped">
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
    </>
  );
};

export default GenerarFactura;