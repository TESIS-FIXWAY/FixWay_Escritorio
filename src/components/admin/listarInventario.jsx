import React from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  updateDoc
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

const ListarInventario = () => {
  const [inventario, setInventario] = React.useState([]);
  const [editingInventarioId, setEditingInventarioId] = React.useState(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = React.useState(false);
  const [deleteInventarioId, setDeleteInventarioId] = React.useState(null);
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const EditarInventarioModal = ({ inventario, onSave, onCancel, onInputChange }) => {
    return (
      <div className="editar-modal">
        <p>Editar inventario</p>
        <label htmlFor="">Codigo Producto</label>
        <input
          type="text"
          value={inventario.codigoProducto}
          onChange={(e) => onInputChange('codigoProducto', e.target.value)}
        />
        <label htmlFor="">Nombre Producto</label>
        <input
          type="text"
          value={inventario.nombreProducto}
          onChange={(e) => onInputChange('nombreProducto', e.target.value)}
        />
        <label htmlFor="">Categoria</label>
        <input
          type="text"
          value={inventario.categoria}
          onChange={(e) => onInputChange('categoria', e.target.value)}
        />
        <label htmlFor="">Marca</label>
        <input
          type="text"
          value={inventario.marca}
          onChange={(e) => onInputChange('marca', e.target.value)}
        />
        <label htmlFor="">Cantidad</label>
        <input
          type="text"
          value={inventario.cantidad}
          onChange={(e) => onInputChange('cantidad', e.target.value)}
        />
        <label htmlFor="">Costo</label>
        <input
          type="text"
          value={inventario.costo}
          onChange={(e) => onInputChange('costo', e.target.value)}
        />
        <button onClick={onSave}>
          <FontAwesomeIcon icon="fa-solid fa-check" />
        </button>
        <button onClick={onCancel}>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      </div>
    );
  };

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'inventario')), (querySnapshot) => {
      const inventarioData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInventario(inventarioData);
    });

    return () => unsubscribe();
  }, []);
  
  const startDelete = (inventarioId) => {
    setDeleteInventarioId(inventarioId);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteInventarioId(null);
    setIsDeleteModalOpen(false);
  }

  const deleteInventario = async (inventarioId) => {
    try {
      await deleteDoc(doc(db, 'inventario', inventarioId));
      setInventario((prevInventario) => prevInventario.filter((inventario) => inventario.id !== inventarioId));
      console.log('Factura eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
    }
  };

  const startEditing = (inventarioId) => {
    setEditingInventarioId(inventarioId);
    setIsEditingModalOpen(true);
  };

  const cancelEditing = () => {
    setEditingInventarioId(null);
    setIsEditingModalOpen(false);
  };

  const saveEdit = async (inventarioId, updatedData) => {
    try {
      await updateDoc(doc(db, 'inventario', inventarioId), updatedData);
      setEditingInventarioId(null);
      setIsEditingModalOpen(false);
      console.log('Factura actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la factura:', error);
    }
  };

  const filtrarInventario = (e) => {
    const texto = e.target.value.toLowerCase();
    const inventarioFiltrados = inventario.filter((inventario) => {
      const { codigoProducto, nombreProducto, categoria, marca, cantidad, costo } = inventario;
      const codigoProductoLower = codigoProducto.toLowerCase();
      const nombreProductoLower = nombreProducto.toLowerCase();
      const categoriaLower = categoria.toLowerCase();
      const marcaLower = marca.toLowerCase();
      const cantidadLower = cantidad.toLowerCase();
      const costoLower = costo.toLowerCase();
      if (
        codigoProductoLower.includes(texto) ||
        nombreProductoLower.includes(texto) ||
        categoriaLower.includes(texto) ||
        marcaLower.includes(texto) ||
        cantidadLower.includes(texto) ||
        costoLower.includes(texto)
      ) {
        return inventario;
      }
      return null;
    });
    setInventario(inventarioFiltrados);
    if (texto === '') {
      window.location.reload();
    }
  };
  
  const handleInputChange = (inventarioId, name, value) => {
    const updatedInventario = inventario.map((inventario) =>
      inventario.id === inventarioId ? { ...inventario, [name]: value } : inventario
    );
    setInventario(updatedInventario);
  };

  const agregarInventario = () => {
    navigate('/agregarInventario');
  }

  return (
    <>
      <Admin />
        <div className="tabla_listar">
          <div className="table_header">
            <p>Listado Inventario</p>
            <div>
              <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
              <input type="text" placeholder="buscar factura" onChange={filtrarInventario}/>
              <button className='boton-ingreso' onClick={agregarInventario}> <FontAwesomeIcon icon="fa-solid fa-cart-flatbed" /> Ingresar Nuevo inventario</button>
            </div>
          </div>
          <div className="table_section">
            <table>
              <thead>
                <tr>
                  <th scope="col">Codigo Producto</th>
                  <th scope="col">Nombre <br /> Producto</th>
                  <th scope="col">Categoria</th>
                  <th scope="col">Marca</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Costo</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((inventario) => (
                 <tr key={inventario.id}>
                    <>
                      <td>{inventario.codigoProducto}</td>
                      <td>{inventario.nombreProducto}</td>
                      <td>{inventario.categoria}</td>
                      <td>{inventario.marca}</td>
                      <td>{inventario.cantidad}</td>
                      <td>{inventario.costo}</td>
                    </>
                    <td>
                      {editingInventarioId === inventario.id ? (
                        <>
                          <div className="fondo_no">
                            <div className="editar">
                              <p className="p_editar">Editar inventario</p>
                              <p className="p_editar">
                                <label htmlFor="">Codigo Producto</label>
                                <input
                                  type="text"
                                  value={inventario.codigoProducto}
                                  onChange={(e) => handleInputChange(inventario.id, 'codigoProducto', e.target.value)}
                                />
                              </p>
                              <p className="p_editar">
                                <label htmlFor="">Nombre Producto</label>
                                <input
                                  type="text"
                                  value={inventario.nombreProducto}
                                  onChange={(e) => handleInputChange(inventario.id, 'nombreProducto', e.target.value)}
                                />
                              </p>
                              {/* <p className="p_editar">
                                <label htmlFor="">Categoria</label>
                                <input
                                  type="text"
                                  value={inventario.categoria}
                                  onChange={(e) => handleInputChange(inventario.id, 'categoria', e.target.value)}
                                />
                              </p> */}
                              <p>
                                <label htmlFor="">Categoria</label>
                                <br />
                                <select
                                  id="categoria"
                                  required
                                  name="categoria"
                                  onChange={(e) => handleInputChange(inventario.id, 'categoria', e.target.value)}
                                >
                                  <option value={inventario.categoria} disabled selected>
                                    Seleccione una categoría
                                  </option>
                                  <option value="Sistema de Suspensión">Sistema de Suspensión</option>
                                  <option value="Afinación del Motor">Afinación del Motor</option>
                                  <option value="Sistema de Inyección Electrónica">Sistema de Inyección Electrónica</option>
                                  <option value="Sistema de Escape">Sistema de Escape</option>
                                  <option value="Sistema de Climatización">Sistema de Climatización</option>
                                  <option value="Sistema de Lubricación">Sistemas de Lubricación</option>
                                  <option value="Sistema de Dirección">Sistema de Dirección</option>
                                  <option value="Sistema de Frenos">Sistema de Frenos</option>
                                  <option value="Sistema de Encendido">Sistema de Encendido</option>
                                  <option value="Inspección de Carrocería y Pintura">Inspección de Carrocería y Pintura</option>
                                  <option value="Sistema de Transmisión">Sistema de Transmisión</option>
                                </select>
                              </p>
                              <p className="p_editar">
                                <label htmlFor="">Marca</label>
                                <input
                                  type="text"
                                  value={inventario.marca}
                                  onChange={(e) => handleInputChange(inventario.id, 'marca', e.target.value)}
                                />
                              </p>
                              <p className="p_editar">
                                <label htmlFor="">Cantidad</label>
                                <input
                                  type="text"
                                  value={inventario.cantidad}
                                  onChange={(e) => handleInputChange(inventario.id, 'cantidad', e.target.value)}
                                />
                              </p>
                              <p className="p_editar">
                                <label htmlFor="">Costo</label>
                                <input
                                  type="text"
                                  value={inventario.costo}
                                  onChange={(e) => handleInputChange(inventario.id, 'costo', e.target.value)}
                                />
                              </p>
                              <button className="guardar" onClick={() => saveEdit(inventario.id, inventario)}>
                                <FontAwesomeIcon icon="fa-solid fa-check" />
                              </button>
                              <button className="cancelar" onClick={() => cancelEditing()}>
                                <FontAwesomeIcon icon="fa-solid fa-xmark" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                      <button onClick={() => startEditing(inventario.id)}>
                        <FontAwesomeIcon icon="fa-solid fa-file-pen" />
                      </button>
                      )}
                      {deleteInventarioId === inventario.id ? (
                        <>
                        <div className='fondo_no'>
                          <div className='editar'>
                          <p className='p_editar'>¿Estás seguro que deseas <br /> eliminar este producto?</p>
                          <button className='guardar' onClick={() => deleteInventario(inventario.id)}><FontAwesomeIcon icon="fa-solid fa-check" /></button>
                          <button className='cancelar' onClick={() => cancelDelete()}><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
                          </div>
                        </div>
                        </>
                      ): (
                        <button onClick={() => startDelete(inventario.id)}><FontAwesomeIcon icon="fa-solid fa-trash"/></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default ListarInventario