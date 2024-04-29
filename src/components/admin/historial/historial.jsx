import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Doughnut } from "react-chartjs-2";
import "../../styles/historial.css";

const HistorialVentas = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("dia");
  const [totalVentas, setTotalVentas] = useState(0);
  const [cantidadBoletas, setCantidadBoletas] = useState(0);
  const [cantidadFacturas, setCantidadFacturas] = useState(0);

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedOption]);

  const fetchData = async () => {
    const historialCollection = collection(db, "historialVentas");
    let startDate, endDate;
    switch (selectedOption) {
      case "dia":
        startDate = selectedDate;
        endDate = selectedDate;
        break;
      case "semana":
        startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - selectedDate.getDay());
        endDate = new Date(selectedDate);
        endDate.setDate(selectedDate.getDate() + (6 - selectedDate.getDay()));
        break;
      case "mes":
        startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        break;
      case "trimestre":
        const trimestre = getTrimestre(selectedDate.getMonth());
        startDate = new Date(selectedDate.getFullYear(), trimestre * 3, 1);
        endDate = new Date(selectedDate.getFullYear(), trimestre * 3 + 3, 0);
        break;
      default:
        startDate = selectedDate;
        endDate = selectedDate;
        break;
    }
    const q = query(
      historialCollection,
      where("fecha", ">=", formatDate(startDate)),
      where("fecha", "<=", formatDate(endDate))
    );
    const historialSnapshot = await getDocs(q);
    const total = historialSnapshot.docs.reduce(
      (acc, doc) => acc + doc.data().totalCompra,
      0
    );
    setTotalVentas(total);

    const boletas = historialSnapshot.docs.filter(
      (doc) => doc.data().tipo === "Boleta"
    ).length;
    setCantidadBoletas(boletas);

    const facturas = historialSnapshot.docs.filter(
      (doc) => doc.data().tipo === "Factura"
    ).length;
    setCantidadFacturas(facturas);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const getTrimestre = (month) => {
    return Math.floor(month / 3);
  };

  const data = {
    labels: ["Boletas", "Facturas"],
    datasets: [
      {
        label: "Ventas",
        data: [cantidadBoletas, cantidadFacturas],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    });
    return formatter.format(amount);
  };

  return (
    <div className="container">
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
      </style>

      <h1 className="title">Historial de Ventas</h1>

      <div className="fechas_selec">
        <select value={selectedOption} onChange={handleOptionChange} className="seleccionar">
          <option value="dia">Día</option>
          <option value="semana">Semana</option>
          <option value="mes">Mes</option>
          <option value="trimestre">Trimestre</option>
        </select>

        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          className="fecha_historial"
          calendarClassName="datepicker-open"
        />
      </div>

      <div className="container_widgets">
        <h3 className="subtitulos_historial"> Ventas</h3>
        <hr style={{ margin: 5 }} />
        <text>{formatCurrency(totalVentas)}</text>
      </div>

      <div className="container_widgets">
        <h3 className="subtitulos_historial"> Boletas</h3>
        <hr style={{ margin: 5 }} />
        <text> {cantidadBoletas} </text>
      </div>

      <div className="container_widgets">
        <h3 className="subtitulos_historial"> Facturas</h3>
        <hr style={{ margin: 5 }} />
        <text> {cantidadFacturas} </text>
      </div>


      <div className="chart-container ">
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default HistorialVentas;
