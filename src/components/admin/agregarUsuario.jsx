import * as React from "react";
import TextField from "@mui/material/TextField";
import "../styles/agregarUsuario.css";
import { useState, useEffect } from "react";
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
import ResetCredential from "./funcionUsuario/resetCredential";
import validadorRUT from "./validadorRUT";
import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AgregarUsuario = () => {
  const [mensaje, setMensaje] = useState(null);
  const [mensajeRut, setMensajeRut] = useState(null);
  const [mensajeValidacion, setMensajeValidacion] = useState(null);
  const identifyUser = auth.currentUser;
  const [user, setUser] = useState(null);
  const [fechaIngreso, setFechaIngreso] = useState(null);
  const [showReauthForm, setShowReauthForm] = useState(false);
  const [rolValue, setRolValue] = useState("");

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

      const nombre = e.target.elements.nombre.value;
      const apellido = e.target.elements.apellido.value;
      const telefono = e.target.elements.telefono.value;
      const direccion = e.target.elements.direccion.value;
      const email = e.target.elements.email.value;
      const password = e.target.elements.password.value;
      const salario = e.target.elements.salario.value;
      const fechaIngreso = e.target.elements.fechaIngreso.value;

      try {
        await signOut(auth);
        const currentUser = auth.currentUser;
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

        setMensaje("Usuario añadido Correctamente");

        await logoutAndReauthenticate();

        clearFormFields();
        setMensajeValidacion(null);
        setMensajeRut(null);
      } catch (error) {
        console.error("Error during user registration:", error);
      } finally {
        setTimeout(() => {
          setMensaje(null);
        }, 2000);
      }
    }
  };

  const validarRutOnChange = () => {
    const rut = document.getElementById("rut").value;
    const validador = new validadorRUT(rut);
    if (validador.esValido) {
      document.getElementById("rut").value = validador.formateado();
      setMensajeRut("RUT válido");
    } else {
      setMensajeRut("RUT inválido");
    }
  };

  const validarCampos = () => {
    if (mensajeRut !== "RUT válido") {
      setMensajeValidacion("El Rut no es válido");
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

    fieldIds.forEach((fieldId) => {
      document.getElementById(fieldId).value = "";
    });
  };

  const logoutAndReauthenticate = async () => {
    try {
      const userEmail = prompt(
        "Ingrese su correo electrónico para agregar el nuevo usuario:"
      );
      const userPassword = prompt("Ingrese su contraseña para confirmar:");

      await signInWithEmailAndPassword(auth, userEmail, userPassword);

      clearFormFields();

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        onSnapshot(userRef, (snapshot) => {
          setUser(snapshot.data());
        });
      }

      console.log("Sesión cerrada y reiniciada correctamente");
    } catch (error) {
      console.error("Error durante el cierre de sesión y reinicio:", error);
    }
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

  return (
    <>
      <Admin />
      <div className="body_formulario">
        <div className="formulario_content">
          <h1 className="formulario_titulo">Agregar Usuario</h1>
          <form className="formulario_form" onSubmit={submitHandler}>
            <p>
              <br />
              <TextField
                label="Rut"
                variant="outlined"
                className="input_formulario"
                id="rut"
                required
                type="text"
                name="rut"
                placeholder="Rut (11.111.111-1)"
                onChange={validarRutOnChange}
              />
              <p className="mensaje_rut">{mensajeRut}</p>
            </p>
            <p>
              <br />
              <FormControl
                sx={{ height: "30px", marginTop: "10px", width: "260px" }}
              >
                <InputLabel id="demo-simple-select-label">ROL</InputLabel>
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
                className="input_formulario"
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
                label="apellido"
                variant="outlined"
                className="input_formulario"
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
                label="Telefono"
                variant="outlined"
                className="input_formulario"
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
                label="Direccion"
                variant="outlined"
                className="input_formulario"
                id="direccion"
                required
                type="text"
                name="direccion"
                placeholder="Direccion"
              />
            </p>
            <p>
              <br />
              <TextField
                label="Salario"
                variant="outlined"
                className="input_formulario"
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
                className="input_formulario"
                id="fechaIngreso"
                required
                type="date"
                name="fechaIngreso"
                onChange={(e) => setFechaIngreso(e.target)}
              />
            </p>
            <p>
              <br />
              <TextField
                label="Correo"
                variant="outlined"
                className="input_formulario"
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
                className="input_formulario"
                id="password"
                required
                type="text"
                name="password"
                placeholder="Cree su Contraseña"
              />
            </p>
            <p className="block_boton">
              <p className="mensaje">{mensaje}</p>
              <p className="mensaje_validacion">{mensajeValidacion}</p>
              <Button
                variant="outlined"
                onClick={logoutAndReauthenticate}
                type="submit"
                size="large"
                style={{ with: "120px", fontSize: "20px" }}
              >
                Agregar Usuario
              </Button>
              {showReauthForm && (
                <>
                  <TextField
                    label="Correo electrónico"
                    variant="outlined"
                    className="input_formulario"
                    id="email-reauth"
                    required
                    type="email"
                  />
                  <TextField
                    label="Contraseña"
                    variant="outlined"
                    className="input_formulario"
                    id="password-reauth"
                    required
                    type="password"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleReauthenticate}
                    size="large"
                    style={{ with: "120px", fontSize: "20px" }}
                  >
                    Reautenticar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowReauthForm(false)}
                    size="large"
                    style={{ with: "120px", fontSize: "20px" }}
                  >
                    Cancelar
                  </Button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default AgregarUsuario;
