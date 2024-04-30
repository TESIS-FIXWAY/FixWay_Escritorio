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
import validadorRUT from "./validadorRUT";
import { Button } from "@mui/material";

const AgregarUsuario = () => {
  const [mensaje, setMensaje] = useState(null);
  const [mensajeRut, setMensajeRut] = useState(null);
  const [mensajeValidacion, setMensajeValidacion] = useState(null);
  const identifyUser = auth.currentUser;
  const [user, setUser] = useState(null);
  const [fechaIngreso, setFechaIngreso] = useState(null);

  useEffect(() => {
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        setUser(snapshot.data());
      });
    }
  }, [identifyUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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

      const rol = e.target.elements.rol.value;
      const nombre = e.target.elements.nombre.value;
      const apellido = e.target.elements.apellido.value;
      const telefono = e.target.elements.telefono.value;
      const direccion = e.target.elements.direccion.value;
      const email = e.target.elements.email.value;
      const password = e.target.elements.password.value;
      const salario = e.target.elements.salario.value;
      const fechaIngreso = e.target.elements.fechaIngreso.value;

      try {
        const currentUser = auth.currentUser;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const newUser = userCredentials.user;

        await setDoc(doc(db, "users", newUser.uid), {
          rut,
          rol,
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
        }, 5000);
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
      await signOut(auth);

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

  return (
    <>
      <Admin />
      <div className="body_formulario">
        <div className="formulario_content">
          <div className="formulario_wrapper">
            <div className="formulario_contact">
              <h1 className="formulario_titulo">Agregar Usuario</h1>
              <form className="formulario_form" onSubmit={submitHandler}>
                <p>
                  <label className="label_formulario">RUT</label>
                  <br />
                  <input
                    className="input_formulario"
                    id="rut"
                    type="text"
                    name="rut"
                    placeholder="Rut (11.111.111-1)"
                    required
                    onChange={validarRutOnChange}
                  />
                  <p className="mensaje_rut">{mensajeRut}</p>
                </p>
                <p>
                  <label className="label_formulario">ROL</label>
                  <br />
                  <select
                    className="input_formulario"
                    id="rol"
                    name="rol"
                    required
                  >
                    <option value="mecanico">Mecánico</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </p>
                <p>
                  <label className="label_formulario">Nombre</label>
                  <br />
                  <input
                    className="input_formulario"
                    id="nombre"
                    required
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                  />
                </p>
                <p>
                  <label className="label_formulario">Apellido</label>
                  <br />
                  <input
                    className="input_formulario"
                    id="apellido"
                    required
                    type="text"
                    name="apellido"
                    placeholder="Apellido"
                  />
                </p>
                <p>
                  <label className="label_formulario">Teléfono</label>
                  <br />
                  <input
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
                  <label className="label_formulario">Dirección</label>
                  <br />
                  <input
                    className="input_formulario"
                    id="direccion"
                    required
                    type="text"
                    name="direccion"
                    placeholder="Direccion"
                  />
                </p>
                <p>
                  <label className="label_formulario">Sueldo</label>
                  <br />
                  <input
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
                  <label className="label_formulario">Fecha de Ingreso</label>
                  <br />
                  <input
                    className="input_formulario"
                    id="fechaIngreso"
                    required
                    type="date"
                    name="fechaIngreso"
                    onChange={(e) => setFechaIngreso(e.target)}
                  />
                </p>
                <p>
                  <label className="label_formulario">Email</label>
                  <br />
                  <input
                    className="input_formulario"
                    id="email"
                    required
                    type="text"
                    name="email"
                    placeholder="Correo"
                  />
                </p>
                <p>
                  <label className="label_formulario">Contraseña</label>
                  <br />
                  <input
                    className="input_formulario"
                    id="password"
                    required
                    type="text"
                    name="password"
                    placeholder="Contraseña"
                  />
                </p>
                <p className="block_boton">
                  <p className="mensaje">{mensaje}</p>
                  <p className="mensaje_validacion">{mensajeValidacion}</p>
                  <Button
                    variant="outlined"
                    type="submit"
                    size="large"
                    style={{ with: "120px", fontSize: "20px" }}
                  >
                    Agregar Usuario
                  </Button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgregarUsuario;
