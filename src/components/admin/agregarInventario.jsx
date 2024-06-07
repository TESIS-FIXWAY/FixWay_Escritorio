import "../styles/darkMode.css";
import React, { useState, useContext } from "react";
import Admin from "./admin";
import { DarkModeContext } from "../../context/darkMode";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AgregarInventario = () => {
  const [formData, setFormData] = useState({
    codigoProducto: "",
    nombreProducto: "",
    descripcion: "",
    cantidad: "",
    costo: "",
    categoria: "",
    marca: "",
  });

  const [mensajeExito, setMensajeExito] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const cantidad = formData.cantidad.replace(/[^0-9]/g, "");
    const costo = Number(formData.costo).toLocaleString("es-CL");
    const id = formData.codigoProducto;

    const data = {
      ...formData,
      cantidad,
      costo,
      id,
    };

    try {
      await setDoc(doc(db, "inventario", id), data);
      setFormData({
        codigoProducto: "",
        nombreProducto: "",
        descripcion: "",
        cantidad: "",
        costo: "",
        categoria: "",
        marca: "",
      });
      setMensajeExito("Inventario agregado exitosamente");
      setTimeout(() => {
        setMensajeExito("");
      }, 3000);
    } catch (error) {
      console.error("Error al agregar el inventario: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cantidad") {
      const cantidadFormateada = value
        .replace(/[^0-9]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setFormData({ ...formData, [name]: cantidadFormateada });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <>
      <header>
        <Admin />
      </header>
      <div className={`body_formulario ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="formulario_content">
          <div className="formulario_wrapper">
            <div className="formulario_contact">
              <h1
                className={`formulario_titulo ${isDarkMode ? "dark-mode" : ""}`}
              >
                Agregar Inventario
              </h1>
              {mensajeExito && (
                <div className="mensaje_exito">{mensajeExito}</div>
              )}
              <form
                className={`formulario_form ${isDarkMode ? "dark-mode" : ""}`}
                onSubmit={submitHandler}
              >
                <p>
                  <br />
                  <TextField
                    label="Código Producto"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="codigoProducto"
                    required
                    type="text"
                    name="codigoProducto"
                    value={formData.codigoProducto}
                    onChange={handleChange}
                    placeholder="Código Producto"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Nombre Producto"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="nombreProducto"
                    required
                    type="text"
                    name="nombreProducto"
                    value={formData.nombreProducto}
                    onChange={handleChange}
                    placeholder="Nombre Producto"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Descripción"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="descripcion"
                    required
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Cantidad"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="cantidad"
                    required
                    type="text"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    placeholder="Cantidad"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Costo"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="costo"
                    required
                    type="text"
                    name="costo"
                    value={formData.costo}
                    onChange={handleChange}
                    placeholder="Ejemplo: 10000"
                  />
                </p>
                <p>
                  <FormControl
                    sx={{ height: "30px", marginTop: "10px", width: "260px" }}
                  >
                    <InputLabel id="categoria-label">
                      Seleccione Categoría
                    </InputLabel>
                    <Select
                      labelId="categoria-label"
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      label="Seleccione Categoría"
                      onChange={handleChange}
                      required
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
                </p>
                <p>
                  <br />
                  <TextField
                    label="Marca"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="marca"
                    required
                    type="text"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                    placeholder="Marca"
                  />
                </p>
                <p className="block_boton">
                  <Button
                    variant="outlined"
                    className="boton_formulario"
                    type="submit"
                  >
                    Agregar Inventario
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

export default AgregarInventario;
