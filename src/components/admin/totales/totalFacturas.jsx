import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TotalFacturas = () => {
  const [historialCompleto, setHistorialCompleto] = useState([]);
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  const [totalPorFecha, setTotalPorFecha] = useState({});
  const [totalPorMes, setTotalPorMes] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchHistorial = async () => {
      const historialCollection = collection(db, "misFacturas");
      const historialSnapshot = await getDocs(historialCollection);
      const historialData = historialSnapshot.docs.map((doc) => {
        const data = doc.data();
        const total = parseFloat(data.total);
        return {
          id: doc.id,
          ...data,
          total: isNaN(total) ? 0 : total,
        };
      });
      setHistorialCompleto(historialData);
      filtrarHistorialPorFecha(selectedDate, historialData);
    };
    fetchHistorial();
  }, []);

  useEffect(() => {
    filtrarHistorialPorFecha(selectedDate, historialCompleto);
  }, [selectedDate, historialCompleto]);

  const calcularTotalPorFecha = (historialData) => {
    const totalPorFecha = {};
    historialData.forEach((item) => {
      const fecha = formatFecha(item.fecha);
      if (fecha === formatFecha(selectedDate)) {
        const total = parseFloat(item.totalCompra);
        totalPorFecha[fecha] =
          (totalPorFecha[fecha] || 0) +
          (Number.isInteger(total) ? total : parseInt(total));
      }
    });
    setTotalPorFecha(totalPorFecha);
    calcularTotalPorMes(historialData);
  };

  const calcularTotalPorMes = (historialData) => {
    const totalPorMes = {};
    historialData.forEach((item) => {
      const fecha = new Date(item.fecha);
      const yearMonth = fecha.getFullYear() + "-" + (fecha.getMonth() + 1);
      if (!totalPorMes[yearMonth]) {
        totalPorMes[yearMonth] = 0;
      }
      const total = parseFloat(item.totalCompra);
      totalPorMes[yearMonth] += Number.isInteger(total)
        ? total
        : parseInt(total);
    });
    setTotalPorMes(totalPorMes);
  };

  const filtrarHistorialPorFecha = (fecha, historialData) => {
    const fechaSeleccionada = formatFecha(fecha);
    const filteredHistorial = historialData.filter((item) => {
      const fechaItem = formatFecha(item.fecha);
      return fechaItem === fechaSeleccionada;
    });
    setHistorialFiltrado(filteredHistorial);
    calcularTotalPorFecha(filteredHistorial);
  };

  const formatFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const day = fechaObj.getDate().toString().padStart(2, "0");
    const month = (fechaObj.getMonth() + 1).toString().padStart(2, "0");
    const year = fechaObj.getFullYear().toString().slice(-2);
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
      <ul>
        {historialFiltrado.map((item) => (
          <li key={item.id}>
            <p>Vendedor: {item.usuario?.firstName}</p>
            <p>Fecha Compra: {formatFecha(item.fecha)}</p>
            <p>Total Compra: {item.totalCompra}</p>
          </li>
        ))}
      </ul>
      <div>
        <h2>Total por Día:</h2>
        {Object.keys(totalPorFecha).map((fecha) => (
          <p key={fecha}>
            {fecha}: {totalPorFecha[fecha]}
          </p>
        ))}
      </div>
      <div>
        <h2>Total por Mes:</h2>
        {Object.keys(totalPorMes).map((yearMonth) => (
          <p key={yearMonth}>
            {yearMonth}: {totalPorMes[yearMonth]}
          </p>
        ))}
      </div>
    </div>
  );
};

export default TotalFacturas;
