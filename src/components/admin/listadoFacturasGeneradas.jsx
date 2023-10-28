import React from "react"
import Admin from "./admin"
import { db } from "../../firebase"
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

const ListadoFacturasGeneradas = () => {
  const navigate = useNavigate();
  const [facturaGeneradas, setFacturaGeneradas] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "mifacturas")), (querySnapshot) => {
      const facturaData = querySnapshot.docs.map((doc) => ({ id : doc.id, ...doc.data() }));
      setFacturaGeneradas(facturaData);
    });

    return () => unsubscribe();
  }, []);



  const eliminarFactura = async (id) => {
    try {
      const docRef = doc(db, "mifactura", id);
      await deleteDoc(docRef);
      console.log("Document deleted");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  }

  const navegarGenerarFactura = () => {
    navigate("/generarFactura");
  }

  const filtrarFacturasGeneradas = (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrado = facturaGeneradas.filter((item) => {
      if (item.nombre.toLowerCase().includes(texto)) {
        return item;
      }
    });
    setFacturaGeneradas(filtrado);
  }

  return (
    <>
      <Admin />
      <div className="tabla_listar">
        <div className="table_header">
          <p>Listado Facturas Generadas</p>
          <div>
            <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="buscar factura" onChange={filtrarFacturasGeneradas}/>
            <button className='boton-ingreso' onClick={navegarGenerarFactura}>Generar Factura</button>
          </div>
        </div>
        <div className="table_section">
          <table>
            <thead>
              <tr>
                <th scope="col">Codigo Producto</th>
                <th scope="col">Nombre Producto</th>
                <th scope="col">Costo</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Marca</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturaGeneradas.map((item) => (
                <tr key={item.id}>
                  <>
                    <td>{item.codigoProducto}</td>
                    <td>{item.nombreProducto}</td>
                    <td>{item.costo}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.marca}</td>
                  </>
                  <td data-label="Acciones">
                    <button className='boton-ingreso' onClick={() => eliminarFactura(item.id)}>
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

export default ListadoFacturasGeneradas