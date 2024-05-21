import React, { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import validadorRUT from "../validadorRUT";
import { useNavigate } from "react-router-dom";

const CrearClienteFactura = () => {
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteApellido, setClienteApellido] = useState("");
  const [clienteRut, setClienteRut] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [mensajeRut, setMensajeRut] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
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
    navigate("/generarFactura");
  };

  return (
    <div className="fondo_no">
      <div className="editar" style={{ width: "500px" }}>
        <div className="descuento-menu">
          <input
            type="text"
            placeholder="Nombre"
            id="nombre"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />
          <input
            type="text"
            id="apellido"
            placeholder="Apellido"
            value={clienteApellido}
            onChange={(e) => setClienteApellido(e.target.value)}
          />
          <input
            type="text"
            placeholder="Rut (11.111.111-1)"
            value={clienteRut}
            id="rut"
            onChange={(e) => setClienteRut(e.target.value)}
            onBlur={validarRutOnChange}
          />
          <p className="mensaje_rut">{mensajeRut}</p>
          <input
            type="text"
            placeholder="Email"
            id="email"
            value={clienteEmail}
            onChange={(e) => setClienteEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ejemplo: +56 9 12345678"
            pattern="[+]56 [0-9]{1} [0-9]{8}"
            id="telefono"
            value={clienteTelefono}
            onChange={(e) => setClienteTelefono(e.target.value)}
          />
          {errorMensaje && <p className="error">{errorMensaje}</p>}
          <button onClick={agregarCliente} style={{ background: "#1DC258" }}>
            Agregar Cliente
          </button>
          <button
            onClick={toggleAgregarCliente}
            style={{ background: "#E74C3C" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearClienteFactura;
