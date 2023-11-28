// Componente ListarInventarioMecanico: 
// Este componente React representa la página de listado de inventario para usuarios con el rol de Mecánico. 
// Proporciona acceso a funciones relacionadas con el inventario, como visualizar y gestionar los elementos existentes. 
// Funciones y Características Principales: 
// Incluye la importación de estilos específicos para la interfaz de administrador. 
// Utiliza el componente 'Mecanico' para mostrar la barra de navegación y mantener la coherencia visual. 
// Contiene un calendario interactivo que permite la gestión de eventos relacionados con el trabajo. 
// Utiliza iconos FontAwesome para mejorar la estética y facilitar la identificación de las funcionalidades. 
// Permite la navegación a otras secciones de la aplicación, como la gestión de mantenciones, listado de usuarios, facturas, listado de facturas, y agregar elementos al inventario. 

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
                  <th scope="col">Código Producto</th>
                  <th scope="col">Nombre <br /> Producto</th>
                  <th scope="col">Categoría</th>
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