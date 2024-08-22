import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import Admin from "./admin";
import validadorRUT from "../../hooks/validadorRUT";
import "../styles/agregarUsuario.css";
import "../styles/darkMode.css";
import { DarkModeContext } from "../../context/darkMode";

const styleReset = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AgregarUsuario = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mensajeRut, setMensajeRut] = useState(null);
  const [mensajeRutError, setMensajeRutError] = useState(null);
  const [mensajeValidacion, setMensajeValidacion] = useState(null);
  const [rolValue, setRolValue] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);
  const [showReauthForm, setShowReauthForm] = useState(false);
  const [reauthEmail, setReauthEmail] = useState("");
  const [reauthPassword, setReauthPassword] = useState("");

  const identifyUser = auth.currentUser;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        setUser(snapshot.data());
      });
    }
  }, [identifyUser]);

  const checkDuplicateRut = async (rut) => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(query(usersRef, where("rut", "==", rut)));
    return !snapshot.empty;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (validarCampos()) {
      const rut = e.target.elements.rut.value;
      const isDuplicateRut = await checkDuplicateRut(rut);
      if (isDuplicateRut) {
        setMensajeValidacion("El Rut ya está registrado en otro usuario");
        return;
      }

      const email = e.target.elements.email.value;
      if (!validateEmail(email)) {
        setMensajeValidacion("El correo electrónico no es válido");
        return;
      }

      try {
        setShowReauthForm(true);
      } catch (error) {
        console.error("Error durante el cierre de sesión y reinicio:", error);
      }
    }
  };

  const handleCreateUser = async () => {
    const form = document.querySelector("form");
    const rut = form.elements.rut.value;
    const nombre = form.elements.nombre.value;
    const apellido = form.elements.apellido.value;
    const telefono = form.elements.telefono.value;
    const direccion = form.elements.direccion.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    const salario = form.elements.salario.value;
    const fechaIngreso = form.elements.fechaIngreso.value;

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredentials.user;

      await setDoc(doc(db, "users", newUser.uid), {
        rut,
        rol: rolValue,
        nombre,
        apellido,
        telefono,
        direccion,
        email,
        salario,
        fechaIngreso,
      });

      setSuccessMessage("Usuario añadido correctamente");
      await logoutAndReauthenticate();
      clearFormFields();
      setMensajeValidacion(null);
      setMensajeRut(null);
    } catch (error) {
      console.error("Error durante el registro del usuario:", error);
    } finally {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  };

  const validarRutOnChange = () => {
    const rut = document.getElementById("rut").value;
    const validador = new validadorRUT(rut);
    if (validador.esValido) {
      document.getElementById("rut").value = validador.formateado();
      setMensajeRut("RUT válido");
      setTimeout(() => setMensajeRut(""), 2000);
    } else {
      setMensajeRutError("RUT inválido");
      setTimeout(() => setMensajeRutError(""), 8000);
    }
  };

  const validarCampos = () => {
    if (mensajeRut !== "RUT válido") {
      setMensajeValidacion("El RUT ya esta registrado");
      return false;
    }
    return true;
  };

  const formatSalaryInput = (input) => {
    const value = input.value.replace(/[^0-9]/g, "");
    if (value.length > 0) {
      input.value = parseInt(value).toLocaleString("es-CL");
    }
  };

  const clearFormFields = () => {
    const fieldIds = [
      "rut",
      "rol",
      "nombre",
      "apellido",
      "telefono",
      "direccion",
      "salario",
      "password",
      "email",
      "fechaIngreso",
    ];
    setReauthEmail("");
    setReauthPassword("");

    fieldIds.forEach((fieldId) => {
      document.getElementById(fieldId).value = "";
    });
  };

  const logoutAndReauthenticate = async () => {
    try {
      await signOut(auth);
      await handleCreateUser();
      await signInWithEmailAndPassword(auth, reauthEmail, reauthPassword);
      console.log("Sesión cerrada y reiniciada correctamente");
    } catch (error) {
      console.error("Error durante el cierre de sesión y reinicio:", error);
    }
  };

  const handleReauthSubmit = async (e) => {
    e.preventDefault();
    await logoutAndReauthenticate();
    setShowReauthForm(false);
    await handleCreateUser();
  };

  const autocompleteAtSymbol = (e) => {
    const inputField = e.target;
    let enteredText = inputField.value.trim();
    enteredText = enteredText.replace(/\s/g, "");
    const atPosition = enteredText.lastIndexOf("@");

    const existingSelect = inputField.parentNode.querySelector(
      ".email-domain-select"
    );
    if (
      atPosition === -1 ||
      enteredText[atPosition + 1] === "" ||
      enteredText.includes(" ")
    ) {
      if (existingSelect) existingSelect.remove();
      return;
    }

    const userPart = enteredText.slice(0, atPosition + 1);
    const domainPart = enteredText.slice(atPosition + 1);
    const domains = ["gmail.com", "outlook.com", "yahoo.com"];

    const suggestions = domains.filter((d) => d.startsWith(domainPart));

    if (suggestions.length > 0) {
      if (!existingSelect) {
        const select = document.createElement("select");
        select.className = "email-domain-select";
        select.innerHTML =
          `<option value="">Seleccione...</option>` +
          suggestions.map((s) => `<option value="${s}">${s}</option>`).join("");

        select.onchange = () => {
          if (select.value) {
            inputField.value = userPart + select.value;
            select.remove();
          }
        };

        inputField.parentNode.appendChild(select);
        inputField.parentNode.insertBefore(select, inputField.nextSibling);
      } else {
        existingSelect.innerHTML =
          `<option value="">Seleccione...</option>` +
          suggestions.map((s) => `<option value="${s}">${s}</option>`).join("");
      }
    } else {
      if (existingSelect) existingSelect.remove();
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleCancelReauth = () => {
    setShowReauthForm(false);
    setReauthEmail("");
    setReauthPassword("");
  };

  return (
    <>
      <header>
        {" "}
        <Admin />{" "}
      </header>
      <div className={`body_formulario ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="formulario_content">
          <h1 className={`formulario_titulo ${isDarkMode ? "dark-mode" : ""}`}>
            Agregar Usuario
          </h1>
          <form
            className={`formulario_form ${isDarkMode ? "dark-mode" : ""}`}
            onSubmit={submitHandler}
          >
            <p>
              <br />
              <TextField
                label="Rut"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="rut"
                required
                type="text"
                name="rut"
                placeholder="Rut (11.111.111-1)"
                onChange={validarRutOnChange}
              />
              {mensajeRut && (
                <Alert severity="success" icon={<CheckCircleIcon />}>
                  {mensajeRut}
                </Alert>
              )}
              {mensajeRutError && (
                <Alert severity="error" icon={<CloseIcon />}>
                  {mensajeRutError}
                </Alert>
              )}
            </p>
            <p>
              <br />
              <FormControl
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
              >
                <InputLabel id="rol-label">ROL</InputLabel>
                <Select
                  labelId="rol-label"
                  id="rol"
                  name="rol"
                  label="rol"
                  required
                  value={rolValue}
                  onChange={(e) => setRolValue(e.target.value)}
                >
                  <MenuItem value="administrador">Administrador</MenuItem>
                  <MenuItem value="mecanico">Mecánico</MenuItem>
                </Select>
              </FormControl>
            </p>
            <p>
              <br />
              <TextField
                label="Nombre"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="nombre"
                required
                type="text"
                name="nombre"
                placeholder="Nombre"
              />
            </p>
            <p>
              <br />
              <TextField
                label="Apellido"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="apellido"
                required
                type="text"
                name="apellido"
                placeholder="Apellido"
              />
            </p>
            <p>
              <br />
              <TextField
                label="Teléfono"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="telefono"
                required
                type="tel"
                name="telefono"
                pattern="[+]56 [0-9]{1} [0-9]{8}"
                placeholder="Ejemplo: +56 9 12345678"
              />
            </p>
            <p>
              <br />
              <TextField
                label="Dirección"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="direccion"
                required
                type="text"
                name="direccion"
                placeholder="Dirección"
              />
            </p>
            <p>
              <br />
              <TextField
                label="Salario"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="salario"
                required
                type="text"
                name="salario"
                placeholder="Salario"
                pattern="[0-9.,]+"
                onChange={(e) => formatSalaryInput(e.target)}
              />
            </p>
            <p>
              <br />
              <TextField
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="fechaIngreso"
                required
                type="date"
                name="fechaIngreso"
              />
            </p>
            <p>
              <br />
              <TextField
                label="Correo"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="email"
                required
                type="text"
                name="email"
                placeholder="Ingrese su Correo"
                onChange={autocompleteAtSymbol}
              />
            </p>
            <p>
              <br />
              <TextField
                label="Contraseña"
                variant="outlined"
                className={`input_formulario ${isDarkMode ? "dark-mode" : ""}`}
                id="password"
                required
                type="password"
                name="password"
                placeholder="Cree su Contraseña"
              />
            </p>
            <p className="block_boton">
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
              <p className="mensaje_validacion">{mensajeValidacion}</p>
              <Button
                variant="outlined"
                type="submit"
                size="large"
                style={{
                  width: "250px",
                  fontSize: "20px",
                  marginTop: "20px",
                }}
              >
                Agregar Usuario
              </Button>
            </p>
          </form>
        </div>
      </div>
      <Modal
        open={showReauthForm}
        onClose={() => setShowReauthForm(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleReset}>
          <form onSubmit={handleReauthSubmit}>
            <h2>Confirmar Usuario</h2>
            <TextField
              label="Correo Electrónico"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type="email"
              value={reauthEmail}
              onChange={(e) => setReauthEmail(e.target.value)}
            />
            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              type="password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="outlined"
              color="success"
              sx={{
                fontSize: "19px",
                left: "20px",
              }}
            >
              Confirmar
            </Button>
            <Button
              onClick={() => handleCancelReauth()}
              variant="outlined"
              color="error"
              sx={{
                fontSize: "19px",
                left: "40px",
              }}
            >
              Cancelar
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default AgregarUsuario;
