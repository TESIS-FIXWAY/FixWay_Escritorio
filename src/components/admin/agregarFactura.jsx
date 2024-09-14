import React, { useState, useContext, useEffect } from "react";
import { storage, db } from "../../dataBase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Admin from "../admin/admin";
import { Button, CircularProgress, Autocomplete } from "@mui/material";
import "../styles/agregarUsuario.css";
import "../styles/darkMode.css";
import { DarkModeContext } from "../../context/darkMode";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const AgregarFactura = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [productIDs, setProductIDs] = useState([]);
  const [state, setState] = useState({
    fecha: "",
    proveedor: "",
    detalle: "",
    url: "",
    productoId: "",
    cantidad: 0,
    precioDetalle: 0,
  });

  useEffect(() => {
    const fetchProductIDs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "inventario"));
        const ids = querySnapshot.docs.map((doc) => doc.id);
        setProductIDs(ids);
      } catch (error) {
        console.error("Error al obtener los IDs de los productos:", error);
        setErrorMessage("Error al cargar los IDs de los productos.");
      }
    };

    fetchProductIDs();
  }, []);

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No se ha seleccionado ningún archivo.");
      return null;
    }
    try {
      setUploading(true);
      const storageRef = ref(storage, `facturas/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Progreso de la subida: ${progress}%`);
          },
          (error) => {
            console.error("Error al subir el archivo:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("URL del archivo subido:", downloadURL);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fecha, proveedor, detalle, productoId, cantidad, precioDetalle } =
      state;
    if (
      !fecha ||
      !proveedor ||
      !detalle ||
      !productoId ||
      cantidad <= 0 ||
      precioDetalle <= 0
    ) {
      setErrorMessage("Datos incompletos o cantidad/precio inválidos.");
      return;
    }

    try {
      const productoRef = doc(db, "inventario", productoId);
      const productoSnap = await getDoc(productoRef);

      if (!productoSnap.exists()) {
        setErrorMessage("Producto no encontrado en el inventario.");
        return;
      }

      const productoData = productoSnap.data();
      const cantidadAnterior = Number(productoData.cantidad) || 0;
      const precioDetalleAnterior = Number(productoData.precioDetalle) || 0;

      const nuevaCantidad = cantidadAnterior + Number(cantidad);
      const nuevoPrecioPromedio =
        (precioDetalleAnterior * cantidadAnterior +
          precioDetalle * Number(cantidad)) /
        nuevaCantidad;

      const downloadURL = await handleUpload();
      if (!downloadURL) {
        setErrorMessage("Error al subir el archivo");
        return;
      }

      await updateDoc(productoRef, {
        cantidad: nuevaCantidad,
        precioDetalle: nuevoPrecioPromedio,
      });

      const timestampNow = serverTimestamp();
      await addDoc(collection(db, "facturas"), {
        fecha,
        proveedor,
        detalle,
        timestamp: timestampNow,
        url: downloadURL,
        productoId,
        cantidad,
        precioDetalle,
      });

      setSuccessMessage(
        "Factura guardada y cantidad actualizada correctamente"
      );
      setState({
        fecha: "",
        proveedor: "",
        detalle: "",
        productoId: "",
        cantidad: 0,
        precioDetalle: 0,
      });
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error al procesar la factura:", error);
      setErrorMessage("Ha ocurrido un error al guardar la factura");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header>
        <Admin />
      </header>
      <div>
        <div className={`body_formulario ${isDarkMode ? "dark-mode" : ""}`}>
          <div className="formulario_content">
            <div className="formulario_contact">
              <h1
                className={`formulario_titulo ${isDarkMode ? "dark-mode" : ""}`}
              >
                Agregar Factura Proveedor
              </h1>
              <form
                className={`formulario_form ${isDarkMode ? "dark-mode" : ""}`}
                onSubmit={handleSubmit}
              >
                <p>
                  <br />
                  <TextField
                    type="date"
                    id="fecha"
                    name="fecha"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    required
                    onChange={(e) => handleChangeText("fecha", e.target.value)}
                    value={state.fecha}
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Proveedor"
                    id="proveedor"
                    type="text"
                    name="proveedor"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    required
                    onChange={(e) =>
                      handleChangeText("proveedor", e.target.value)
                    }
                    value={state.proveedor}
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Detalle"
                    required
                    type="text"
                    name="detalle"
                    id="detalle"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    onChange={(e) =>
                      handleChangeText("detalle", e.target.value)
                    }
                    value={state.detalle}
                  />
                </p>
                <p>
                  <br />
                  {/* Autocomplete for ProductoId */}
                  <Autocomplete
                    id="productoId"
                    options={productIDs}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ID del Producto"
                        className={`input_formulario ${
                          isDarkMode ? "dark-mode" : ""
                        }`}
                        required
                      />
                    )}
                    onChange={(event, newValue) => {
                      handleChangeText("productoId", newValue);
                    }}
                    value={state.productoId}
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Cantidad"
                    required
                    type="number"
                    name="cantidad"
                    id="cantidad"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    onChange={(e) =>
                      handleChangeText("cantidad", parseInt(e.target.value))
                    }
                    value={state.cantidad}
                    inputProps={{ min: 1 }}
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Precio Detalle"
                    required
                    type="number"
                    name="precioDetalle"
                    id="precioDetalle"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    onChange={(e) =>
                      handleChangeText(
                        "precioDetalle",
                        parseFloat(e.target.value)
                      )
                    }
                    value={state.precioDetalle}
                    inputProps={{ min: 0 }}
                  />
                </p>
                <p>
                  <br />
                  <input type="file" onChange={handleFileChange} />
                  {filePreview && (
                    <div className="file-preview">
                      <img src={filePreview} alt="Vista previa del archivo" />
                    </div>
                  )}
                </p>
                <p>
                  <br />
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Agregar Factura"
                    )}
                  </Button>
                </p>
                {errorMessage && (
                  <Alert
                    severity="error"
                    sx={{ marginTop: "10px" }}
                    icon={<CloseIcon />}
                  >
                    {errorMessage}
                  </Alert>
                )}
                {successMessage && (
                  <Alert
                    severity="success"
                    sx={{ marginTop: "10px" }}
                    icon={<CheckCircleIcon />}
                  >
                    {successMessage}
                  </Alert>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgregarFactura;
