import React, { useState, useContext } from "react";
import { storage, db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Admin from "../admin/admin";
import { Button } from "@mui/material";
import "../styles/agregarUsuario.css";
import "../styles/darkMode.css";
import { DarkModeContext } from "../../context/darkMode";
import TextField from "@mui/material/TextField";

const AgregarFactura = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [state, setState] = useState({
    fecha: "",
    proveedor: "",
    detalle: "",
    url: "",
  });

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
    const { fecha, proveedor, detalle } = state;
    if (!fecha || !proveedor || !detalle) {
      setMensaje("Datos incompletos");
      return;
    }

    try {
      setUploading(true);
      const downloadURL = await handleUpload();
      if (!downloadURL) {
        setMensaje("Error al subir el archivo");
        return;
      }

      const timestampNow = serverTimestamp();
      const docRef = await addDoc(collection(db, "facturas"), {
        fecha,
        proveedor,
        detalle,
        timestamp: timestampNow,
        url: downloadURL,
      });

      console.log("Documento escrito con ID:", docRef.id);
      setMensaje("Se ha guardado correctamente");
      setState({ fecha: "", proveedor: "", detalle: "" });
      setFile(null);
    } catch (error) {
      console.error("Error al agregar el documento:", error);
      setMensaje("Ha ocurrido un error al guardar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header>
        {" "}
        <Admin />{" "}
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
                  <label className="label_formulario">
                    Seleccionar Archivo
                  </label>
                  <br />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                  />
                </p>
                {mensaje && <p className="mensaje">{mensaje}</p>}
                <p className="block_boton">
                  <Button
                    variant="outlined"
                    type="submit"
                    size="large"
                    disabled={uploading}
                    style={{ with: "120px", fontSize: "20px" }}
                  >
                    Agregar Factura Proveedor
                  </Button>
                  {uploading && <p>Subiendo Archivo</p>}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgregarFactura;
