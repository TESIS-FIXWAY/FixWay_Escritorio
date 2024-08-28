import React, { useState, useEffect, useContext } from "react";
import Admin from "./admin";
import { db } from "../../dataBase/firebase";
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";
import { DarkModeContext } from "../../context/darkMode";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/gestionMantenciones.css";
import "../styles/darkMode.css";

const GestionMantencionesAdmin = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterPeriod, setFilterPeriod] = useState("today");
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mantencionesCollection = collection(db, "mantenciones");
        const q = query(mantencionesCollection);

        const unsubscribeMantenciones = onSnapshot(q, (querySnapshot) => {
          const allTasksData = [];

          querySnapshot.forEach((doc) => {
            const task = {
              id: doc.id,
              ...doc.data(),
              estado: doc.data().estado,
            };
            allTasksData.push(task);
          });

          allTasksData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

          setTasks(allTasksData);
        });

        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = {};
        usersSnapshot.forEach((doc) => {
          usersData[doc.id] = doc.data();
        });

        setUsers(usersData);

        return () => unsubscribeMantenciones();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getUserName = (userId) => {
    const user = users[userId];
    return user ? `${user.nombre} ${user.apellido}` : "Desconocido";
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const translateEstado = (estado) => {
    switch (estado) {
      case "atencion_especial":
        return "Atención Especial";
      case "pendiente":
        return "Pendiente";
      case "prioridad":
        return "Prioridad";
      case "en proceso":
        return "En Proceso";
      case "terminado":
        return "Terminado";
      default:
        return estado;
    }
  };

  const formatoKilometraje = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const getDateRange = (period) => {
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    switch (period) {
      case "today":
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        const dayOfWeek = startDate.getDay();
        const startOfWeek = new Date(startDate);
        startOfWeek.setDate(startDate.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startDate);
        endOfWeek.setDate(startDate.getDate() + (6 - dayOfWeek));
        endOfWeek.setHours(23, 59, 59, 999);
        return { start: startOfWeek, end: endOfWeek };
      case "month":
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "year":
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(12, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        return { start: startDate, end: endDate };
    }

    return { start: startDate, end: endDate };
  };

  const filterTasksByDate = (task) => {
    const taskDate = new Date(task.fecha);
    const { start, end } = getDateRange(filterPeriod);
    return taskDate >= start && taskDate <= end;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearchTerm =
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(task.personaTomadora)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      formatoKilometraje(task.kilometrajeMantencion)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      task.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.productos.some((producto) =>
        producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      filterStatus === "todos" || task.estado === filterStatus;
    const matchesDate = filterTasksByDate(task);
    return matchesSearchTerm && matchesStatus && matchesDate;
  });

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
            Tareas
          </Typography>
          <input
            type="text"
            placeholder="Buscar producto"
            name="text"
            className="input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="todos">Estado</option>
            <option value="pendiente">Pendiente</option>
            <option value="en proceso">En Proceso</option>
            <option value="terminado">Terminado</option>
          </select>
          <div className="datepicker-container">
            <DatePicker
              selected={currentDate}
              onChange={(date) => setCurrentDate(date)}
              placeholderText="Fecha Actual"
              className="input"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <select
            className="input"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="today">Hoy</option>
            <option value="week">Semana Actual</option>
            <option value="month">Mes Actual</option>
            <option value="year">Año Actual</option>
          </select>
        </div>
        <div className="table_section">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patente</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Persona a Cargo</TableCell>
                  <TableCell>Kilometraje</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Productos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>{translateEstado(task.estado)}</TableCell>
                    <TableCell>{getUserName(task.personaTomadora)}</TableCell>
                    <TableCell>
                      {formatoKilometraje(task.kilometrajeMantencion)}
                    </TableCell>
                    <TableCell>{formatDate(new Date(task.fecha))}</TableCell>
                    <TableCell>{task.descripcion}</TableCell>
                    <TableCell>
                      {task.productos.map((producto) => (
                        <div key={producto.id}>
                          {producto.nombreProducto} - {producto.cantidad}
                        </div>
                      ))}
                    </TableCell>
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

export default GestionMantencionesAdmin;
