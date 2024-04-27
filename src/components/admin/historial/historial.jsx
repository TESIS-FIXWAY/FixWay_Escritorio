import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HistorialVentas = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalVentas, setTotalVentas] = useState(0);
  const [cantidadBoletas, setCantidadBoletas] = useState(0);
  const [cantidadFacturas, setCantidadFacturas] = useState(0);

  useEffect(() => {
    const fetchTotalVentas = async () => {
      const historialCollection = collection(db, "historialVentas");
      const q = query(
        historialCollection,
        where("fecha", "==", formatDate(selectedDate))
      );
      const historialSnapshot = await getDocs(q);
      const total = historialSnapshot.docs.reduce(
        (acc, doc) => acc + doc.data().totalCompra,
        0
      );
      setTotalVentas(total);

      const boletas = historialSnapshot.docs.filter(
        (doc) => doc.data().tipo === "Boleta"
      );
      setCantidadBoletas(boletas.length);

      const facturas = historialSnapshot.docs.filter(
        (doc) => doc.data().tipo === "Factura"
      );
      setCantidadFacturas(facturas.length);
    };
    fetchTotalVentas();
  }, [selectedDate]);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h1>Historial de Ventas</h1>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
      />
      <div>
        <h2>Total Ventas del Día:</h2>
        <p>{totalVentas}</p>
      </div>
      <div>
        <h2>Boletas:</h2>
        <p>{cantidadBoletas}</p>
      </div>
      <div>
        <h2>Facturas:</h2>
        <p>{cantidadFacturas}</p>
      </div>
    </div>
  );
};

export default HistorialVentas;
