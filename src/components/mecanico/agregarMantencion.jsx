import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Alert,
  List,
  ListItem,
  ListItemText,
  Modal,
  Box,
} from "@mui/material";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Mecanico from "./mecanico";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AgregarMantencion = () => {
  const [patente, setPatente] = useState("");
  const [tipoMantencion, setTipoMantencion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const [kilometrajeMantencion, setKilometrajeMantencion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [productos, setProductos] = useState([]);
  const [mantencionesPendientes, setMantencionesPendientes] = useState([]);
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        if (!tipoMantencion) {
          setProductos([]);
          return;
        }

        const inventarioRef = collection(db, "inventario");
        const q = query(
          inventarioRef,
          where("categoria", "==", tipoMantencion)
        );

        const snapshot = await getDocs(q);
        const productosData = [];

        snapshot.forEach((doc) => {
          const producto = doc.data();
          productosData.push(producto);
        });

        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar productos:", error.message);
      }
    };

    cargarProductos();
  }, [tipoMantencion]);

  const handleCheckPatente = async (text) => {
    try {
      if (typeof text !== "string" || text.trim() === "") {
        setErrorMessage("La patente no es válida.");
        setSuccessMessage("");
        setPatente("");
        return;
      }

      setPatente(text);
      const carDocM = doc(db, "automoviles", text);
      const carDocSnapshotM = await getDoc(carDocM);

      if (carDocSnapshotM.exists() && carDocSnapshotM.data()) {
        setSuccessMessage("Automóvil encontrado");
        setErrorMessage("");
      } else {
        setErrorMessage("No se encontró un automóvil con esa patente");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error checking patente:", error.message);
      setErrorMessage("Error al verificar la patente. Inténtelo de nuevo.");
      setSuccessMessage("");
    }
  };

  const handleAddMantencion = async () => {
    try {
      if (
        !patente ||
        !tipoMantencion ||
        !descripcion ||
        !estado ||
        !kilometrajeMantencion ||
        !productoSeleccionado
      ) {
        setErrorMessage("Por favor, complete todos los campos.");
        return;
      }

      if (typeof patente !== "string" || patente.trim() === "") {
        setErrorMessage("La patente no es válida.");
        return;
      }

      await handleCheckPatente(patente);

      const mantencionData = {
        patente: patente,
        tipoMantencion: tipoMantencion,
        descripcion: descripcion,
        fecha: new Date().toISOString(),
        estado: estado,
        kilometrajeMantencion: kilometrajeMantencion,
        productos: [{ nombreProducto: productoSeleccionado }],
      };

      setMantencionesPendientes([...mantencionesPendientes, mantencionData]);

      alert("Mantención agregada a la lista de pendientes");
    } catch (error) {
      console.error("Error saving maintenance:", error.message);
      setErrorMessage("Error al guardar la mantención. Inténtelo de nuevo.");
    }
  };

  const handleConfirmationAndSave = async () => {
    hideConfirmationModal();
    try {
      const batch = writeBatch(db);
      let tareaCount = 1;

      for (const mantencion of mantencionesPendientes) {
        const tareaId = `Tarea-${tareaCount}`;
        const mantencionDocRef = doc(
          db,
          "mantenciones",
          `${mantencion.patente}-${tareaId}`
        );
        batch.set(mantencionDocRef, mantencion);
        tareaCount++;
      }

      await batch.commit();

      setPatente("");
      setTipoMantencion("");
      setDescripcion("");
      setEstado("");
      setKilometrajeMantencion("");
      setProductoSeleccionado("");
      setErrorMessage("");

      setMantencionesPendientes([]);
      alert("Mantenciones guardadas correctamente");
    } catch (error) {
      console.error("Error saving mantenciones:", error.message);
      setErrorMessage("Error al guardar las mantenciones. Inténtelo de nuevo.");
    }
  };

  const showConfirmationModal = () => {
    setConfirmationModalVisible(true);
  };

  const hideConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

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

  return (
    <>
      <header>
        <Mecanico />
      </header>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Agregar Mantención
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Patente del auto"
          value={patente}
          onChange={(e) => handleCheckPatente(e.target.value)}
          variant="outlined"
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && (
          <Alert severity="success" icon={<CheckCircleIcon />}>
            {successMessage}
          </Alert>
        )}
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel variant="outlined">Tipo de Mantención</InputLabel>
          <Select
            value={tipoMantencion}
            onChange={(e) => setTipoMantencion(e.target.value)}
          >
            <MenuItem value="">Todas las Categorías</MenuItem>
            <MenuItem value="Sistema de Suspensión">
              Sistema de Suspensión
            </MenuItem>
            <MenuItem value="Afinación del Motor">Afinación del Motor</MenuItem>
            <MenuItem value="Sistema de Inyección Electrónica">
              Sistema de Inyección Electrónica
            </MenuItem>
            <MenuItem value="Sistema de Escape">Sistema de Escape</MenuItem>
            <MenuItem value="Sistema de Climatización">
              Sistema de Climatización
            </MenuItem>
            <MenuItem value="Sistema de Lubricación">
              Sistema de Lubricación
            </MenuItem>
            <MenuItem value="Sistema de Dirección">
              Sistema de Dirección
            </MenuItem>
            <MenuItem value="Sistema de Frenos">Sistema de Frenos</MenuItem>
            <MenuItem value="Sistema de Encendido">
              Sistema de Encendido
            </MenuItem>
            <MenuItem value="Inspección de Carrocería y Pintura">
              Inspección de Carrocería y Pintura
            </MenuItem>
            <MenuItem value="Sistema de Transmisión">
              Sistema de Transmisión
            </MenuItem>
            <MenuItem value="Herramientas y Equipos">
              Herramientas y Equipos
            </MenuItem>
            <MenuItem value="Sistema de Refrigeración">
              Sistema de Refrigeración
            </MenuItem>
            <MenuItem value="Accesorios y Personalización">
              Accesorios y Personalización
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel variant="outlined">Producto</InputLabel>
          <Select
            value={productoSeleccionado}
            onChange={(e) => setProductoSeleccionado(e.target.value)}
          >
            <MenuItem value="">Seleccione un Producto</MenuItem>
            {productos.map((producto, index) => (
              <MenuItem key={index} value={producto.nombreProducto}>
                {producto.nombreProducto}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          variant="outlined"
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel variant="outlined">Estado</InputLabel>
          <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <MenuItem value="atencion_especial">Atención Especial</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="prioridad">Prioridad</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Kilometraje Mantención"
          value={kilometrajeMantencion}
          onChange={(e) => setKilometrajeMantencion(e.target.value)}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddMantencion}
        >
          Agregar Mantención
        </Button>
        <Typography variant="h5" component="h2" gutterBottom>
          Mantenciones Pendientes
        </Typography>
        <List>
          {mantencionesPendientes.map((mantencion, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Mantención ${index + 1}`}
                secondary={
                  <>
                    <strong>Patente:</strong> {mantencion.patente} <br />
                    <strong>Tipo de Mantención:</strong>{" "}
                    {mantencion.tipoMantencion} <br />
                    <strong>Descripción:</strong> {mantencion.descripcion}{" "}
                    <br />
                    <strong>Fecha:</strong>{" "}
                    {formatDate(new Date(mantencion.fecha))} <br />
                    <strong>Estado:</strong>{" "}
                    {translateEstado(mantencion.estado)} <br />
                    <strong>Kilometraje:</strong>{" "}
                    {formatoKilometraje(mantencion.kilometrajeMantencion)}{" "}
                    <br />
                    <strong>Producto:</strong>{" "}
                    {mantencion.productos[0].nombreProducto}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          color="secondary"
          onClick={showConfirmationModal}
        >
          Guardar todas las mantenciones
        </Button>
        <Modal
          open={isConfirmationModalVisible}
          onClose={hideConfirmationModal}
          aria-labelledby="confirmation-modal-title"
          aria-describedby="confirmation-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              outline: "none",
            }}
          >
            <Typography
              id="confirmation-modal-title"
              variant="h6"
              component="h2"
              gutterBottom
            >
              Confirmación de guardado
            </Typography>
            <Typography id="confirmation-modal-description" sx={{ mb: 2 }}>
              ¿Está seguro de que desea guardar todas las mantenciones
              pendientes?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmationAndSave}
              sx={{ mr: 2 }}
            >
              Confirmar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={hideConfirmationModal}
            >
              Cancelar
            </Button>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default AgregarMantencion;
