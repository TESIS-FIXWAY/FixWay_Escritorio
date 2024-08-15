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
import { Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

const AgregarInventario = () => {
  const [formData, setFormData] = useState({
    codigoProducto: "",
    nombreProducto: "",
    descripcion: "",
    cantidad: "",
    costo: "",
    origen: "",
    categoria: "",
    marcaAutomovil: "",
    anoProductoUsoInicio: "",
    anoProductoUsoFin: "",
    marcaProducto: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    const cantidad = formData.cantidad.replace(/[^0-9]/g, "");
    const costo = parseInt(formData.costo.replace(/\./g, ""), 10);
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
        origen: "",
        categoria: "",
        marcaAutomovil: "",
        anoProductoUsoInicio: "",
        anoProductoUsoFin: "",
        marcaProducto: "",
      });
      setSuccessMessage("Producto agregado correctamente");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al agregar el inventario: ", error);
      setErrorMessage("Error al agregar el producto. Inténtalo de nuevo.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "costo") {
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
                  <FormControl
                    sx={{ height: "30px", marginTop: "20px", width: "225px" }}
                  >
                    <InputLabel id="marcaAutomovil-label">
                      Seleccione Marca Automóvil
                    </InputLabel>
                    <Select
                      labelId="marcaAutomovil-label"
                      id="marcaAutomovil"
                      name="marcaAutomovil"
                      value={formData.marcaAutomovil}
                      label="Seleccione Marca Automóvil"
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value={"Todas las marcas"}>
                        Todas las marcas
                      </MenuItem>
                      <MenuItem value={"Toyota"}>Toyota</MenuItem>
                      <MenuItem value={"Honda"}>Honda</MenuItem>
                      <MenuItem value={"Ford"}>Ford</MenuItem>
                      <MenuItem value={"Chevrolet"}>Chevrolet</MenuItem>
                      <MenuItem value={"Volkswagen"}>Volkswagen</MenuItem>
                      <MenuItem value={"Nissan"}>Nissan</MenuItem>
                      <MenuItem value={"Hyundai"}>Hyundai</MenuItem>
                      <MenuItem value={"Suzuki"}>Suzuki</MenuItem>
                      <MenuItem value={"Kia"}>Kia</MenuItem>
                      <MenuItem value={"Mazda"}>Mazda</MenuItem>
                      <MenuItem value={"Mitsubishi"}>Mitsubishi</MenuItem>
                      <MenuItem value={"Subaru"}>Subaru</MenuItem>
                      <MenuItem value={"Citroën"}>Citroën</MenuItem>
                      <MenuItem value={"Peugeot"}>Peugeot</MenuItem>
                      <MenuItem value={"Audi"}>Audi</MenuItem>
                      <MenuItem value={"BMW"}>BMW</MenuItem>
                      <MenuItem value={"Mercedes-Benz"}>Mercedes-Benz</MenuItem>
                      <MenuItem value={"Fiat"}>Fiat</MenuItem>
                      <MenuItem value={"Chery"}>Chery</MenuItem>
                      <MenuItem value={"Dodge"}>Dodge</MenuItem>
                      <MenuItem value={"Geely"}>Geely</MenuItem>
                      <MenuItem value={"JAC"}>JAC</MenuItem>
                      <MenuItem value={"Jeep"}>Jeep</MenuItem>
                      <MenuItem value={"MG"}>MG</MenuItem>
                      <MenuItem value={"Mini"}>Mini</MenuItem>
                      <MenuItem value={"Ram"}>Ram</MenuItem>
                      <MenuItem value={"SsangYong"}>SsangYong</MenuItem>
                      <MenuItem value={"BYD"}>BYD</MenuItem>
                      <MenuItem value={"Changan"}>Changan</MenuItem>
                      <MenuItem value={"Chrysler"}>Chrysler</MenuItem>
                      <MenuItem value={"Dongfeng"}>Dongfeng</MenuItem>
                      <MenuItem value={"Foton"}>Foton</MenuItem>
                      <MenuItem value={"GAC"}>GAC</MenuItem>
                      <MenuItem value={"Great Wall"}>Great Wall</MenuItem>
                      <MenuItem value={"Haval"}>Haval</MenuItem>
                      <MenuItem value={"JMC"}>JMC</MenuItem>
                      <MenuItem value={"Lifan"}>Lifan</MenuItem>
                      <MenuItem value={"Mahindra"}>Mahindra</MenuItem>
                      <MenuItem value={"Opel"}>Opel</MenuItem>
                      <MenuItem value={"Renault"}>Renault</MenuItem>
                      <MenuItem value={"Skoda"}>Skoda</MenuItem>
                      <MenuItem value={"Tata"}>Tata</MenuItem>
                      <MenuItem value={"Volvo"}>Volvo</MenuItem>
                      <MenuItem value={"Alfa Romeo"}>Alfa Romeo</MenuItem>
                      <MenuItem value={"BAIC"}>BAIC</MenuItem>
                      <MenuItem value={"Brilliance"}>Brilliance</MenuItem>
                    </Select>
                  </FormControl>
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
                  <br />
                  <TextField
                    label="Origen"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="origen"
                    required
                    type="text"
                    name="origen"
                    value={formData.origen}
                    onChange={handleChange}
                    placeholder="Origen"
                  />
                </p>
                <p>
                  <FormControl
                    sx={{ height: "30px", marginTop: "20px", width: "225px" }}
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
                    label="Año de Uso Inicio"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="anoProductoUsoInicio"
                    required
                    type="text"
                    name="anoProductoUsoInicio"
                    value={formData.anoProductoUsoInicio}
                    onChange={handleChange}
                    placeholder="Año de Uso Inicio"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Año de Uso Fin"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="anoProductoUsoFin"
                    required
                    type="text"
                    name="anoProductoUsoFin"
                    value={formData.anoProductoUsoFin}
                    onChange={handleChange}
                    placeholder="Año de Uso Fin"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Marca Producto"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="marcaProducto"
                    required
                    type="text"
                    name="marcaProducto"
                    value={formData.marcaProducto}
                    onChange={handleChange}
                    placeholder="Marca Producto"
                  />
                </p>
                <p className="block_boton">
                  <Button
                    variant="outlined"
                    className="boton_formulario"
                    type="submit"
                    sx={{
                      marginTop: "20px",
                      fontSize: "20px",
                    }}
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
