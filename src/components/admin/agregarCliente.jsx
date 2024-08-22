import React, { useState, useContext } from "react";
import "../styles/agregarUsuario.css";
import { db } from "../../firebase";
import { DarkModeContext } from "../../context/darkMode";
import { collection, addDoc } from "firebase/firestore";
import validadorRUT from "../../hooks/validadorRUT";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Admin from "./admin";

const CrearCliente = () => {
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteApellido, setClienteApellido] = useState("");
  const [clienteRut, setClienteRut] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mensajeEmail, setMensajeEmail] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);

  const validarRutOnChange = () => {
    const rut = document.getElementById("rut").value;
    const validador = new validadorRUT(rut);
    if (validador.esValido) {
      document.getElementById("rut").value = validador.formateado();
      setTimeout(() => setSuccessMessage(""), 8000);
      setSuccessMessage("Rut válido");
    } else {
      setErrorMessage("Rut inválido");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const agregarCliente = async () => {
    if (
      !clienteNombre ||
      !clienteApellido ||
      !clienteRut ||
      !clienteEmail ||
      !clienteTelefono
    ) {
      setErrorMensaje("Todos los campos son obligatorios.");
      return;
    }

    if (!validarEmail(clienteEmail)) {
      setMensajeEmail("Email inválido.");
      return;
    } else {
      setMensajeEmail("");
    }

    try {
      await addDoc(collection(db, "clientes"), {
        nombre: clienteNombre,
        apellido: clienteApellido,
        rut: clienteRut,
        email: clienteEmail,
        telefono: clienteTelefono,
      });
      setClienteNombre("");
      setClienteApellido("");
      setClienteRut("");
      setClienteEmail("");
      setClienteTelefono("");

      setErrorMensaje("");
      setMensajeEmail("");
      alert("Cliente agregado exitosamente!");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <>
      <header>
        <Admin />
      </header>
      <div className={`body_formulario ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="formulario_content">
          <h1 className={`formulario_titulo ${isDarkMode ? "dark-mode" : ""}`}>
            Agregar Cliente
          </h1>
          <form className={`formulario_form ${isDarkMode ? "dark-mode" : ""}`}>
            <p>
              <br />
              <TextField
                label="Nombre"
                variant="outlined"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
              />
            </p>
            <p>
              <br />
              <TextField
                label="Apellido"
                variant="outlined"
                value={clienteApellido}
                onChange={(e) => setClienteApellido(e.target.value)}
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
              />
            </p>
            <p>
              <br />
              <TextField
                label="Rut (11.111.111-1)"
                variant="outlined"
                value={clienteRut}
                id="rut"
                onChange={(e) => setClienteRut(e.target.value)}
                onBlur={validarRutOnChange}
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
              />
            </p>
            <Typography
              variant="body2"
              color="textSecondary"
              className={isDarkMode ? "dark-mode" : ""}
            >
              {successMessage && (
                <Alert severity="success" icon={<CheckCircleIcon />}>
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert severity="error" icon={<CloseIcon />}>
                  {errorMessage}
                </Alert>
              )}
            </Typography>
            <p>
              <br />
              <TextField
                label="Email"
                variant="outlined"
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
              />
            </p>
            <Typography
              variant="body2"
              color="error"
              className={isDarkMode ? "dark-mode" : ""}
            >
              {mensajeEmail}
            </Typography>
            <p>
              <br />
              <TextField
                label="Teléfono (Ejemplo: +56 9 12345678)"
                variant="outlined"
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
                inputProps={{ pattern: "[+]56 [0-9]{1} [0-9]{8}" }}
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
              />
            </p>
            {errorMensaje && (
              <Typography
                variant="body2"
                color="error"
                className={isDarkMode ? "dark-mode" : ""}
              >
                {errorMensaje}
              </Typography>
            )}
            <Box display="flex" justifyContent="space-between">
              <Button
                onClick={agregarCliente}
                variant="outlined"
                className={isDarkMode ? "dark-mode" : ""}
                sx={{
                  marginTop: "110px",
                  fontSize: "18px",
                  right: "100px",
                }}
              >
                Agregar Cliente
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </>
  );
};

export default CrearCliente;
