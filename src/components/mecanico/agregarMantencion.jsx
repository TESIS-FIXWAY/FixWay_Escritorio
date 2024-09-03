import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/darkMode";
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
import { db } from "../../dataBase/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import Mecanico from "./mecanico";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

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
  const [cantidadProducto, setCantidadProducto] = useState("");
  const [codigoProducto, setCodigoProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [isPreviewModalVisible, setPreviewModalVisible] = useState(false);
  const [isAISuggestionModalVisible, setAISuggestionModalVisible] =
    useState(false);
  const [aiSuggestion, setAISuggestion] = useState("");
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDxk1AIyWngyaSkGiYlYC6Kqu--AhdXGws"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const { isDarkMode } = useContext(DarkModeContext);

  const limpiarCampos = () => {
    setTipoMantencion("");
    setDescripcion("");
    setEstado("");
    setKilometrajeMantencion("");
    setProductoSeleccionado("");
    setCantidadProducto("");
    setCodigoProducto("");
    setPrecioProducto("");
    setErrorMessage("");
    setSuccessMessage("");
  };

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

  const aiSugerencia = async () => {
    try {
      const prompt = `
        Sugiere una recomendacion a largo plazo.
        Tipo de Mantención: ${tipoMantencion}
        Kilometraje de Mantención: ${kilometrajeMantencion}
        Productos seleccionados: ${productoSeleccionado}
      `;

      const result = await model.generateContentStream(prompt);

      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = await chunk.text();
        fullText += chunkText;
        console.log(chunkText);
      }

      if (fullText.trim()) {
        setAISuggestion(fullText.trim());
        setAISuggestionModalVisible(true);
      } else {
        console.error(
          "Error: La respuesta del modelo no contiene sugerencias."
        );
        setErrorMessage("Error al obtener la sugerencia. Inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error al obtener la sugerencia de AI:", error.message);
      setErrorMessage("Error al obtener la sugerencia. Inténtelo de nuevo.");
    }
  };

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
        !productoSeleccionado ||
        !cantidadProducto ||
        !precioProducto ||
        !codigoProducto
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
        productos: [
          {
            nombreProducto: productoSeleccionado,
            cantidad: cantidadProducto,
            precio: precioProducto,
            codigoProducto: codigoProducto,
          },
        ],
      };

      setMantencionesPendientes([...mantencionesPendientes, mantencionData]);
      limpiarCampos();
    } catch (error) {
      console.error("Error saving maintenance:", error.message);
      setErrorMessage("Error al guardar la mantención. Inténtelo de nuevo.");
    }
  };

  const handleConfirmationAndSave = async () => {
    hideConfirmationModal();
    try {
      const batch = writeBatch(db);

      for (const mantencion of mantencionesPendientes) {
        const mantencionRef = collection(db, "mantenciones");
        const q = query(
          mantencionRef,
          where("patente", "==", mantencion.patente)
        );

        const mantencionesSnapshot = await getDocs(q);
        const tareaIds = mantencionesSnapshot.docs.map((doc) =>
          doc.id.split("-").pop()
        );

        const highestTareaId = Math.max(...tareaIds.map(Number), 0);
        const nextTareaId = highestTareaId + 1;

        const tareaId = `Tarea-${nextTareaId}`;
        const mantencionDocRef = doc(
          db,
          "mantenciones",
          `${mantencion.patente}-${tareaId}`
        );

        const costoTotal = mantencion.productos.reduce(
          (total, producto) => total + producto.precio * producto.cantidad,
          0
        );

        const mantencionConCosto = { ...mantencion, costoTotal };

        batch.set(mantencionDocRef, mantencionConCosto);
      }

      await batch.commit();

      setPatente("");
      setTipoMantencion("");
      setDescripcion("");
      setEstado("");
      setKilometrajeMantencion("");
      setProductoSeleccionado("");
      setPrecioProducto("");
      setCantidadProducto("");
      setCodigoProducto("");
      setErrorMessage("");

      setMantencionesPendientes([]);
    } catch (error) {
      console.error("Error saving mantenciones:", error.message);
      setErrorMessage("Error al guardar las mantenciones. Inténtelo de nuevo.");
    }
  };

  const handleProductoSeleccionado = async (productoNombre) => {
    const productoExistente = productos.find(
      (p) => p.nombreProducto === productoNombre
    );
    if (productoExistente) {
      setProductoSeleccionado(productoNombre);
      setCantidadProducto(productoExistente.cantidad);
      setPrecioProducto(productoExistente.costo);
      setCodigoProducto(productoExistente.id);
    } else {
      console.error(
        `El producto ${productoNombre} no existe en la lista de productos.`
      );
    }

    console.log("Precio del producto seleccionado:", precioProducto);
  };

  const showConfirmationModal = () => {
    setConfirmationModalVisible(true);
  };

  const hideConfirmationModal = () => {
    setConfirmationModalVisible(false);
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

  const showPreviewModal = () => {
    setPreviewModalVisible(true);
  };

  const hidePreviewModal = () => {
    setPreviewModalVisible(false);
  };

  const handleOpenAISuggestionModal = () => setAISuggestionModalVisible(true);
  const handleCloseAISuggestionModal = () => setAISuggestionModalVisible(false);

  return (
    <>
      <header>
        <Mecanico />
      </header>
      <div className={`body_formulario ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="formulario_content">
          <Container
            className={`formulario_titulo ${isDarkMode ? "dark-mode" : ""}`}
          >
            <Typography variant="h5" component="h5" gutterBottom>
              Agregar Mantención
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Patente del auto"
              value={patente}
              onChange={(e) => handleCheckPatente(e.target.value.toUpperCase())}
              variant="outlined"
            />
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                {successMessage}
              </Alert>
            )}
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Mantención</InputLabel>
              <Select
                value={tipoMantencion}
                onChange={(e) => setTipoMantencion(e.target.value)}
              >
                <MenuItem value={"Sistema de Suspensión"}>
                  Sistema de Suspensión
                </MenuItem>
                <MenuItem value={"Afinación del Motor"}>
                  Afinación del Motor
                </MenuItem>
                <MenuItem value={"Sistema de Inyección Electrónica"}>
                  Sistema de Inyección Electrónica
                </MenuItem>
                <MenuItem value={"Sistema de Escape"}>
                  Sistema de Escape
                </MenuItem>
                <MenuItem value={"Sistema de Climatización"}>
                  Sistema de Climatización
                </MenuItem>
                <MenuItem value={"Sistema de Lubricación"}>
                  Sistema de Lubricación
                </MenuItem>
                <MenuItem value={"Sistema de Dirección"}>
                  Sistema de Dirección
                </MenuItem>
                <MenuItem value={"Sistema de Frenos"}>
                  Sistema de Frenos
                </MenuItem>
                <MenuItem value={"Sistema de Encendido"}>
                  Sistema de Encendido
                </MenuItem>
                <MenuItem value={"Inspección de Carrocería y Pintura"}>
                  Inspección de Carrocería y Pintura
                </MenuItem>
                <MenuItem value={"Sistema de Transmisión"}>
                  Sistema de Transmisión
                </MenuItem>
                <MenuItem value={"Sistema de Refrigeración"}>
                  Sistema de Refrigeración
                </MenuItem>
                <MenuItem value={"Accesorios y Personalización"}>
                  Accesorios y Personalización
                </MenuItem>
                <MenuItem value={"Herramientas y Equipos"}>
                  Herramientas y Equipos
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Producto</InputLabel>
              <Select
                value={productoSeleccionado}
                onChange={(e) => handleProductoSeleccionado(e.target.value)}
              >
                {productos.map((producto) => (
                  <MenuItem key={producto.id} value={producto.nombreProducto}>
                    {producto.nombreProducto}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Precio del Producto"
              value={precioProducto}
              onChange={(e) => setPrecioProducto(e.target.value)}
              variant="outlined"
              disabled
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              variant="outlined"
              multiline
              rows={2}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value="atencion_especial">Atención Especial</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="prioridad">Prioridad</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Kilometro de Mantención"
              value={kilometrajeMantencion}
              onChange={(e) => setKilometrajeMantencion(e.target.value)}
              variant="outlined"
            />
            <Button
              variant="outlined"
              color="primary"
              sx={{ right: "12px" }}
              onClick={aiSugerencia}
            >
              Obtener Sugerencia de IA
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddMantencion}
            >
              Agregar Mantención
            </Button>
          </Container>
          <Container
            className={`formulario_mantenciones_pendientes ${
              isDarkMode ? "dark-mode" : ""
            }`}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={showPreviewModal}
              style={{ marginTop: "16px" }}
            >
              Vista Previa de Mantenciones
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={showConfirmationModal}
              style={{ marginTop: "16px", left: "15px", color: "green" }}
            >
              Confirmar y Guardar Mantenciones
            </Button>
          </Container>
          <Modal open={isPreviewModalVisible} onClose={hidePreviewModal}>
            <Box
              p={4}
              style={{
                backgroundColor: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "45%",
                maxHeight: "80%",
                overflowY: "auto",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Vista Previa de Mantenciones
              </Typography>
              <List>
                {mantencionesPendientes.map((mantencion, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Patente: ${mantencion.patente}, Tipo: ${
                        mantencion.tipoMantencion
                      }, Estado: ${translateEstado(
                        mantencion.estado
                      )}, Descripción: ${
                        mantencion.descripcion
                      }, Kilometraje: ${formatoKilometraje(
                        mantencion.kilometrajeMantencion
                      )}`}
                      secondary={`Productos: ${mantencion.productos
                        .map(
                          (producto) =>
                            `${producto.nombreProducto} (Código Producto: ${
                              producto.codigoProducto
                            }, Precio: $${producto.precio.toLocaleString(
                              "es-CL"
                            )})`
                        )
                        .join(", ")}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="contained"
                color="primary"
                onClick={hidePreviewModal}
              >
                Cerrar
              </Button>
            </Box>
          </Modal>
          <Modal
            open={isConfirmationModalVisible}
            onClose={hideConfirmationModal}
          >
            <Box
              p={4}
              style={{
                backgroundColor: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
              }}
            >
              <Typography variant="h6" component="h2" gutterBottom>
                Confirmar Guardado de Mantenciones
              </Typography>
              <Typography variant="body1" gutterBottom>
                ¿Está seguro de que desea guardar todas las mantenciones
                pendientes?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmationAndSave}
                style={{ marginTop: "16px" }}
              >
                Confirmar y Guardar
              </Button>
              <Button
                variant="contained"
                onClick={hideConfirmationModal}
                style={{ marginTop: "16px", left: "15px" }}
              >
                Cancelar
              </Button>
            </Box>
          </Modal>
          <Modal
            open={isAISuggestionModalVisible}
            onClose={handleCloseAISuggestionModal}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 1000,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6">Sugerencia de Gemini IA</Typography>
              <Typography>{aiSuggestion}</Typography>
              <Button onClick={handleCloseAISuggestionModal}>Cerrar</Button>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default AgregarMantencion;
