import React, { useState } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
} from "firebase/firestore";
import { deleteDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faFilePen, 
  faTrash, 
  faMagnifyingGlass, 
  faCheck, 
  faDownload,
  faXmark,
  faFileCirclePlus
} from '@fortawesome/free-solid-svg-icons';
library.add(
  faFilePen,
  faTrash,
  faMagnifyingGlass,
  faCheck,
  faXmark,
  faDownload,
  faFileCirclePlus
);

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
  const navigate = useNavigate();

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

  const agregarFactura = () => {
    navigate('/agregarFactura');
  }

  return (
    <>
      <Admin/>
        <div className="tabla_listar">
          <div className="table_header">
            <p>Listado de Facturas</p>
            <div>
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
              <input type="text" placeholder="buscar factura" onChange={filtrarFactura}/>
              <FontAwesomeIcon icon="fa-solid fa-file-circle-plus" />
              <button className='boton-ingreso' onClick={agregarFactura}> + Ingresar Nueva Factura</button>
            </div>
          </div>
          <div className="table_section">
            <table>
              <thead>
                <tr>
                  <th scope="col">Proveedor</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Detalle</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id}>
                    <td>{factura.proveedor}</td>
                    <td>{factura.fecha}</td>
                    <td>{factura.detalle}</td>
                    <td>
                      <button>
                        <FontAwesomeIcon icon="fa-solid fa-file-pen" />
                      </button>
                      <button>
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button onClick={() => deletefactura(factura.id)}>
                        <FontAwesomeIcon icon="fa-solid fa-trash" />
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

export default ListadoFacturas;