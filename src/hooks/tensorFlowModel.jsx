import React, { useState, useEffect, useContext } from "react";
import * as tf from "@tensorflow/tfjs"; // Importar TensorFlow.js
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
// import Admin from "../components/admin/admin";
// import "../components/styles/listarUsuario";


const TensorflowModel = () => {
const [inventario, setInventario] = useState([]);
const [recomendaciones, setRecomendaciones] = useState([]);
const [productosBajaDemanda, setProductosBajaDemanda] = useState([]);
const [productosAltaDemanda, setProductosAltaDemanda] = useState([]);

useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "inventario")), (querySnapshot) => {
    const inventarioData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    setInventario(inventarioData);

    // Aquí llamamos a la función para procesar los datos con TensorFlow
    procesarDatosConTensorFlow(inventarioData);
    });

    return () => unsubscribe();
}, []);

const procesarDatosConTensorFlow = async (inventarioData) => {
    // Aquí deberías cargar o definir el modelo TensorFlow
    // const model = await tf.loadLayersModel('path/to/model.json');
    // Para este ejemplo, vamos a simular algunas recomendaciones

    // Productos a punto de agotarse (umbral arbitrario de 10 unidades)
    const productosAgotandose = inventarioData.filter(item => item.cantidad <= 10);
    
    // Simular análisis de tendencias (puede basarse en el historial de ventas)
    const productosBaja = inventarioData.filter(item => item.cantidad > 50); // Baja demanda
    const productosAlta = inventarioData.filter(item => item.cantidad < 20); // Alta demanda
    
    // Guardar las recomendaciones en el estado
    setRecomendaciones(productosAgotandose);
    setProductosBajaDemanda(productosBaja);
    setProductosAltaDemanda(productosAlta);
};

return (
    <>
    {/* <Admin /> */}
    <div>
        <div className="table_section">
            <h2>Recomendaciones de Stock</h2>
            <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad Actual</TableCell>
                    <TableCell>Recomendación</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {recomendaciones.map((producto) => (
                    <TableRow key={producto.id}>
                    <TableCell>{producto.nombreProducto}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    <TableCell>Reponer Stock</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>

            <h2>Productos de Baja Demanda</h2>
            <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad Actual</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {productosBajaDemanda.map((producto) => (
                    <TableRow key={producto.id}>
                    <TableCell>{producto.nombreProducto}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>

            <h2>Productos de Alta Demanda</h2>
            <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad Actual</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {productosAltaDemanda.map((producto) => (
                    <TableRow key={producto.id}>
                    <TableCell>{producto.nombreProducto}</TableCell>
                    <TableCell>{producto.cantidad}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    </div>
    </>
);
};

export default TensorflowModel;
