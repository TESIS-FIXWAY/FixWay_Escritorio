import React from "react";
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

const ListarInventario = () => {
  const [inventario, setInventario] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'inventario')), (querySnapshot) => {
      const inventarioData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInventario(inventarioData);
    });

    return () => unsubscribe();
  }, []);
  
  const deleteInventario = async (inventarioId) => {
    try {
      await deleteDoc(doc(db, 'inventario', inventarioId));
      setInventario((prevInventario) => prevInventario.filter((inventario) => inventario.id !== inventarioId));
      console.log('Factura eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
    }
  };

  const filtrarInventario = (e) => {
    const texto = e.target.value.toLowerCase();
    const inventarioFiltrados = inventario.filter((inventario) => {
      const proveedor = inventario.proveedor.toLowerCase();
      const fecha = inventario.fecha.toLowerCase();
      const detalle = inventario.detalle.toLowerCase();
      return proveedor.includes(texto) || fecha.includes(texto) || detalle.includes(texto);
    });
    setInventario(inventarioFiltrados);
  };
  
  const agregarInventario = () => {
    navigate('/agregarInventario');
  }

  return (
    <>
      <Admin />
        <div className="tabla_listar">
          <div className="table_header">
            <p>Listado de Facturas</p>
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
                  <th scope="col">Nombre Producto</th>
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
                      <button onClick={() => deleteInventario(inventario.id)}>
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
  )
}

export default ListarInventario