import React, { useState } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { collection, getDocs, onSnapshot, query, addDoc, doc, updateDoc } from "firebase/firestore";
import { deleteDoc } from 'firebase/firestore';


const ListadoFacturas = () => {
  const filtrarFactura = (e) => {
    const texto = e.target.value.toLowerCase();
    const facturasFiltrados = facturas.filter((factura) => {
      const proveedor = factura.proveedor.toLowerCase();
      const fecha = factura.fecha.toLowerCase();
      const detalle = factura.detalle.toLowerCase();
      return (
        proveedor.includes(texto) ||
        fecha.includes(texto) ||
        detalle.includes(texto)
      );
    });
    setFacturas(facturasFiltrados);
    if (texto === '') {
      window.location.reload();
    }
    if (usuariosFiltrados.map((factura) => factura.fecha).length === 0 ) {
      return alert('No se encontraron facturas con esa fecha');
    }
  }

  const [facturas, setFacturas] = useState([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'facturas')), (querySnapshot) => {
      const facturasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacturas(facturasData);
    });

    return () => unsubscribe();
  }, []);

  const deletefactura = async (facturaId) => {
    try {
      await deleteDoc(doc(db, 'facturas', facturaId));
      setFacturas((prevFactura) => prevFactura.filter((factura) => factura.id !== facturaId));
      console.log('Factura eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
    }
  };

  return (
    <>
      <Admin/>
        <div className="container">
          <div>
            <p>Listado de Facturas</p>
          </div>
          <div>
            <input type="text" placeholder="buscar factura" onChange={filtrarFactura}/>
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Cliente</th>
                <th scope="col">Fecha</th>
                <th scope="col">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.id}>
                  <td>{factura.id}</td>
                  <td>{factura.proveedor}</td>
                  <td>{factura.fecha}</td>
                  <td>
                    <button>Mostrar detalles</button>
                    <p id="info"></p>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deletefactura(factura.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  );
}

export default ListadoFacturas;