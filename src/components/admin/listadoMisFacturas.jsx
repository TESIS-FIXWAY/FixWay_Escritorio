import React, { useState } from "react";
import Admin from "./admin";
import { db, storage } from "../../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
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

const ListadoMisFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const navigate = useNavigate();
  const [editingFacturaId, setEditingFacturaId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteFacturaId, setDeleteFacturaId] = useState(null);
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'misFacturas'), (querySnapshot) => {
      const facturasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacturas(facturasData);
    });

    return () => unsubscribe();
  }, []);

  const downloadPDF = async (pdfPath) => {
    try {
      const storageRef = ref(storage, pdfPath);
      const url = await getDownloadURL(storageRef);
      console.log(url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error al descargar el archivo PDF:', error);
    }
  };

  const startDelete = (facturaId) => {
    setDeleteFacturaId(facturaId);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteFacturaId(null);
    setIsDeleteModalOpen(false);
  }

  const deletefactura = async (facturaId) => {
    try {
      await deleteDoc(doc(db, 'misFacturas', facturaId));
      setFacturas((prevFactura) => prevFactura.filter((factura) => factura.id !== facturaId));
      console.log('Factura eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
    }
  };

  const startEditing = (facturaId) => {
    setEditingFacturaId(facturaId);
    setIsEditingModalOpen(true);
  };

  const cancelEditing = () => {
    setEditingFacturaId(null);
    setIsEditingModalOpen(false);
  };

  const saveEdit = async (facturaId, updatedData) => {
    try {
      await updateDoc(doc(db, 'facturas', facturaId), updatedData);
      setEditingFacturaId(null);
      setIsEditingModalOpen(false);
      console.log('Factura actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la factura:', error);
    }
  };

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
      setRefresh((prevRefresh) => !prevRefresh);
    }
  }

  const onInputChange = (name, value) => {
    const updatedFacturas = facturas.map((factura) =>
      factura.id === editingFacturaId ? { ...factura, [name]: value } : factura
    );
    setFacturas(updatedFacturas);
  };

  return (
    <>
      <Admin/>
        <div className="tabla_listar">
          <div className="table_header">
            <h1>Listado de Mis Facturas</h1>
            <div>
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
              <input type="text" placeholder="buscar factura" onChange={filtrarFactura}/>
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
                  <div key={factura.id} className="factura-item">
                    <div className="factura-info">
                      <h2>Factura de {factura.tipoPago}</h2>
                    </div>
                    <div className="factura-actions">
                      <button onClick={() => downloadPDF(factura.url)}>
                        <FontAwesomeIcon icon={faDownload} />
                        Descargar PDF
                      </button>
                    </div>
                  </div>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  );
}

export default ListadoMisFacturas;