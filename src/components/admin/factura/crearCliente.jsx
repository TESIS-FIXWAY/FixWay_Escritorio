import React, { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import validadorRUT from "../validadorRUT";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const CrearClienteFactura = () => {
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteApellido, setClienteApellido] = useState("");
  const [clienteRut, setClienteRut] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [mensajeRut, setMensajeRut] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [mensajeEmail, setMensajeEmail] = useState("");
  const navigate = useNavigate();

  const validarRutOnChange = () => {
    const rut = document.getElementById("rut").value;
    const validador = new validadorRUT(rut);
    if (validador.esValido) {
      document.getElementById("rut").value = validador.formateado();
      setMensajeRut("Rut válido");
    } else {
      setMensajeRut("Rut inválido");
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
      setMensajeRut("");
      setErrorMensaje("");
      setMensajeEmail("");
      alert("Cliente agregado exitosamente!");
      navigate("/generarFactura");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const toggleAgregarCliente = () => {
    setClienteNombre("");
    setClienteApellido("");
    setClienteRut("");
    setClienteEmail("");
    setClienteTelefono("");
    setMensajeRut("");
    setErrorMensaje("");
    setMensajeEmail("");
    navigate("/generarFactura");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      className="fondo_no"
    >
      <Paper elevation={3} style={{ width: "500px", padding: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Crear Cliente para Factura
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nombre"
            variant="outlined"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />
          <TextField
            label="Apellido"
            variant="outlined"
            value={clienteApellido}
            onChange={(e) => setClienteApellido(e.target.value)}
          />
          <TextField
            label="Rut (11.111.111-1)"
            variant="outlined"
            value={clienteRut}
            id="rut"
            onChange={(e) => setClienteRut(e.target.value)}
            onBlur={validarRutOnChange}
          />
          <Typography variant="body2" color="textSecondary">
            {mensajeRut}
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            value={clienteEmail}
            onChange={(e) => setClienteEmail(e.target.value)}
          />
          <Typography variant="body2" color="error">
            {mensajeEmail}
          </Typography>
          <TextField
            label="Teléfono (Ejemplo: +56 9 12345678)"
            variant="outlined"
            value={clienteTelefono}
            onChange={(e) => setClienteTelefono(e.target.value)}
            inputProps={{ pattern: "[+]56 [0-9]{1} [0-9]{8}" }}
          />
          {errorMensaje && (
            <Typography variant="body2" color="error">
              {errorMensaje}
            </Typography>
          )}
          <Box display="flex" justifyContent="space-between">
            <Button
              onClick={agregarCliente}
              variant="contained"
              color="success"
            >
              Agregar Cliente
            </Button>
            <Button
              onClick={toggleAgregarCliente}
              variant="contained"
              color="error"
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CrearClienteFactura;
