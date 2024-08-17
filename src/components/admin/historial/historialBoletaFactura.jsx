import React, { useState, useEffect, useContext } from "react";
import Admin from "../admin";
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
import { DarkModeContext } from "../../../context/darkMode";

export default function HistorialBoletasYFacturas() {
  const [boletas, setBoletas] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boletasCollection = collection(db, "misBoletas");
        const boletasSnapshot = await getDocs(boletasCollection);
        const boletasData = boletasSnapshot.docs.map((doc) => doc.data());
        setBoletas(boletasData);

        const facturasCollection = collection(db, "misFacturas");
        const facturasSnapshot = await getDocs(facturasCollection);
        const facturasData = facturasSnapshot.docs.map((doc) => doc.data());
        setFacturas(facturasData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const formatoDinero = (amount) => {
    const integerAmount = Math.floor(amount);

    return `${integerAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const translateEstado = (tipoPago) => {
    switch (tipoPago) {
      case "credito":
        return "Crédito";
      case "contado":
        return "Contado";
      case "debito":
        return "Débito";
      default:
        return tipoPago;
    }
  };

  return (
    <>
      <Admin />
      <div className={`tabla_listar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`table_header ${isDarkMode ? "dark-mode" : ""}`}>
          <Typography
            variant="h3"
            textAlign="center"
            className={`generarQR_titulo ${isDarkMode ? "dark-mode" : ""}`}
          >
            Historial de Ventas
          </Typography>
          <div className="table_section">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Orden Transacción</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Tipo de Pago</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boletas.map((boleta, index) => (
                    <TableRow key={`boleta-${index}`}>
                      <TableCell>{boleta.fecha}</TableCell>
                      <TableCell>
                        {boleta.ordenTransaccion
                          ? boleta.ordenTransaccion
                          : "Efectivo"}
                      </TableCell>
                      <TableCell>{boleta.time}</TableCell>
                      <TableCell>{boleta.tipo}</TableCell>
                      <TableCell>{translateEstado(boleta.tipoPago)}</TableCell>
                      <TableCell>{formatoDinero(boleta.total)}</TableCell>
                    </TableRow>
                  ))}
                  {facturas.map((factura, index) => (
                    <TableRow key={`factura-${index}`}>
                      <TableCell>{factura.fecha}</TableCell>
                      <TableCell>
                        {factura.ordenTransaccion
                          ? factura.ordenTransaccion
                          : "Efectivo"}
                      </TableCell>
                      <TableCell>{factura.time}</TableCell>
                      <TableCell>{factura.tipo}</TableCell>
                      <TableCell>{translateEstado(factura.tipoPago)}</TableCell>
                      <TableCell>{formatoDinero(factura.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
