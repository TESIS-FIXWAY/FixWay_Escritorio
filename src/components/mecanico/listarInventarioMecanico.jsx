import React from "react";
import Mecanico from "./mecanico";
import { db } from "../../firebase";
import { 
  collection, 
  onSnapshot, 
  query
} from "firebase/firestore";
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
  const [filteredInventario, setFilteredInventario] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'inventario')), (querySnapshot) => {
      const inventarioData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInventario(inventarioData);
      setFilteredInventario(inventarioData); // Initialize filtered data with all data
    });

    return () => unsubscribe();
  }, []);

  const filtrarInventario = (e) => {
    const texto = e.target.value.toLowerCase();
    const inventarioFiltrados = inventario.filter((item) => {
      const {
        codigoProducto,
        nombreProducto,
        categoria,
        marca,
        cantidad,
        costo,
      } = item;
      return (
        codigoProducto.toLowerCase().includes(texto) ||
        nombreProducto.toLowerCase().includes(texto) ||
        categoria.toLowerCase().includes(texto) ||
        marca.toLowerCase().includes(texto) ||
        String(cantidad).toLowerCase().includes(texto) ||
        String(costo).toLowerCase().includes(texto)
      );
    });
    setFilteredInventario(inventarioFiltrados);
  };
  

  return (
    <>
      <Mecanico />
        <div className="tabla_listar">
          <div className="table_header">
            <p>Listado Inventario</p>
            <div>
                <FontAwesomeIcon icon="magnifying-glass" />
                <input type="text" placeholder="Buscar Inventario" onChange={filtrarInventario}/>
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
                </tr>
              </thead>
              <tbody>
                {filteredInventario.map((item) => (
                    <tr key={item.id}>
                        <td>{item.codigoProducto}</td>
                        <td>{item.nombreProducto}</td>
                        <td>{item.categoria}</td>
                        <td>{item.marca}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.costo}</td>
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