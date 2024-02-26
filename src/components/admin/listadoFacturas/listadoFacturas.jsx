import React, { useState } from "react";
import Admin from "../admin";
import { db, storage } from "../../../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { deleteDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EditarUsuarioModalFactura from "./editarUsuarioModalFactura";
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
  const [facturas, setFacturas] = useState([]);
  const navigate = useNavigate();
  const [editingFacturaId, setEditingFacturaId] = useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [deleteFacturaId, setDeleteFacturaId] = useState(null);
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const editarUsuarioModalFactura = ({ factura, onSave, onCancel, onInputChange }) => {
    return (
      <EditarUsuarioModalFactura 
        factura={factura}
        onSave={onSave}
        onCancel={onCancel}
        onInputChange={onInputChange}
      />
    ) 
  }

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'facturas')), (querySnapshot) => {
      const facturasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacturas(facturasData);
    });

    return () => unsubscribe();
  }, [refresh]);

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
      await deleteDoc(doc(db, 'facturas', facturaId));
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

  const onInputChange = (name, value) => {
    const updatedFacturas = facturas.map((factura) =>
      factura.id === editingFacturaId ? { ...factura, [name]: value } : factura
    );
    setFacturas(updatedFacturas);
  };

  const agregarFactura = () => {
    navigate('/agregarFactura');
  }

  return (
    <>
      <Admin/>
        <div className="tabla_listar">
          <div className="table_header">
            <h1>Listado de Facturas Proveedores</h1>
            <div>
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
              <input type="text" placeholder="buscar factura" onChange={filtrarFactura}/>
              <button className='boton-ingreso' onClick={agregarFactura}> <FontAwesomeIcon icon="fa-solid fa-file-circle-plus" /> Ingresar Nueva Factura</button>
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
                      {editingFacturaId === factura.id ? (
                        <>
                          <div className="fondo_no">
                            <div className="editar">
                              <p className="p_editar">
                                <label className="etiqueta_editar">Proveedor</label>
                                <input
                                  type="text"
                                  value={factura.proveedor}
                                  onChange={(e) => onInputChange('proveedor', e.target.value)}
                                />
                              </p>
                              <p className="p_editar">
                                <label className="etiqueta_editar">Fecha</label>
                                <input
                                  type="date"
                                  value={factura.fecha}
                                  onChange={(e) => onInputChange('fecha', e.target.value)}
                                />
                              </p>
                              <p className="p_editar">
                                <label className="etiqueta_editar">Detalle</label>
                                <input
                                  type="text"
                                  value={factura.detalle}
                                  onChange={(e) => onInputChange('detalle', e.target.value)}
                                />
                              </p>
                              <button className="guardar" onClick={() => saveEdit(factura.id, { proveedor: factura.proveedor, fecha: factura.fecha, detalle: factura.detalle })}>
                                <FontAwesomeIcon icon="fa-solid fa-check" />
                              </button>
                              <button className="cancelar" onClick={cancelEditing}>
                                <FontAwesomeIcon icon="fa-solid fa-xmark" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                      <button onClick={() => startEditing(factura.id)}>
                        <FontAwesomeIcon icon="fa-solid fa-file-pen" />
                      </button>
                      )}
                      <button style={{ backgroundColor: '#1DC258' }}>
                        <FontAwesomeIcon onClick={() => downloadPDF(factura.url)} icon={faDownload} />
                      </button>
                      {deleteFacturaId === factura.id ? (
                        <>
                        <div className='fondo_no'>
                          <div className='editar'>
                          <p className='p_editar'>¿Estás seguro de que deseas <br /> eliminar esta factura?</p>
                          <button className='guardar' onClick={() => deletefactura(factura.id)}><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                          <button className='cancelar' onClick={() => cancelDelete()}><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                          </div>
                        </div>
                        </>
                      ): (
                        <button onClick={() => startDelete(factura.id)} style={{ backgroundColor: 'red',}}><FontAwesomeIcon icon="fa-solid fa-trash"/></button>
                      )}
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