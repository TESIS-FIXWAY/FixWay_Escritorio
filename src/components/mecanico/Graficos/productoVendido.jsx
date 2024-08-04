import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export default function ProductoMasVendido() {
  const [productSales, setProductSales] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mantenciones"));
        const productSalesData = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.productos && Array.isArray(data.productos)) {
            data.productos.forEach((product) => {
              const { nombreProducto, cantidad, precio, codigoProducto } =
                product;
              if (productSalesData[nombreProducto]) {
                productSalesData[nombreProducto].cantidad += cantidad;
              } else {
                productSalesData[nombreProducto] = {
                  cantidad,
                  precio,
                  codigoProducto,
                };
              }
            });
          }
        });

        const sortedProductSales = Object.entries(productSalesData)
          .map(([name, { cantidad, precio, codigoProducto }]) => ({
            name,
            cantidad,
            precio,
            codigoProducto,
          }))
          .sort((a, b) => b.cantidad - a.cantidad)
          .slice(0, 10);

        setProductSales(sortedProductSales);
      } catch (error) {
        console.error("Error fetching sales data: ", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Productos Más Vendidos
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código Producto</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Precio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productSales.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.codigoProducto}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.precio}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
