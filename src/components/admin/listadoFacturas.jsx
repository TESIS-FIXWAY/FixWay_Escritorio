// Este componente ListadoFacturas maneja la visualización y gestión del listado de facturas de proveedores. 
// Proporciona funciones para editar, eliminar y buscar facturas, así como para descargar archivos PDF asociados. 
// Utiliza FontAwesome para los iconos y React Router para la navegación entre diferentes secciones. 

  
// Funciones y características principales: 
// Listado de facturas de proveedores con información detallada. 
// Funcionalidad para buscar facturas por proveedor, fecha o detalle. 
// Botón para agregar una nueva factura con navegación a la página correspondiente. 
// Edición y eliminación de facturas con confirmación a través de modales. 
// Descarga de archivos PDF asociados a las facturas. 

import React, { useState } from "react";
import Admin from "./admin";
import { db, storage } from "../../firebase";
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

  const EditarUsuarioModalFactura = ({ factura, onSave, onCancel, onInputChange }) => {
    return (
      <div className="editar-modal">
        <p>Editar factura</p>
        <label htmlFor="">Proveedor</label>
        <input
          type="text"
          value={factura.proveedor}
          onChange={(e) => onInputChange('proveedor', e.target.value)}
        />
        <label htmlFor="">Fecha</label>
        <input 
          type="date"
          value={factura.fecha}
          onChange={(e) => onInputChange('fecha', e.target.value)}
        />
        <label htmlFor="">Detalle</label>
        <input
          type="text"
          value={factura.detalle}
          onChange={(e) => onInputChange('detalle', e.target.value)}
        />
        <button onClick={onSave}>
          <FontAwesomeIcon icon="fa-solid fa-check" />
        </button>
        <button onClick={onCancel}>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      </div>
    );
  }

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'facturas')), (querySnapshot) => {
      const facturasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFacturas(facturasData);
    });

    return () => unsubscribe();
  }, []);

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
      window.location.reload();
    }
    if (usuariosFiltrados.map((factura) => factura.fecha).length === 0 ) {
      return alert('No se encontraron facturas con esa fecha');
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
            <p>Listado de Facturas Proveedores</p>
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
                          <p className='p_editar'>¿Estás seguro que deseas <br /> eliminar esta factura?</p>
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