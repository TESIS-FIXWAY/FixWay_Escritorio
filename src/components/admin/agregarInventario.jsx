import "../styles/darkMode.css";
import React, { useState, useContext } from "react";
import Admin from "./admin";
import { DarkModeContext } from "../../context/darkMode";
import { db, storage } from "../../dataBase/firebase"; // Asegúrate de exportar `storage` desde tu archivo de configuración de Firebase
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
    precioDetalle: "", 
    imagenURL: "" 
  });
  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
  
    const cantidad = formData.cantidad.replace(/[^0-9]/g, "");
    const costo = parseInt(formData.costo.replace(/\./g, ""), 10);
    const id = formData.codigoProducto;
  
    let imagenURL = ""; // Definir imagenURL antes de usarlo
  
    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      try {
        await uploadBytes(imageRef, imageFile);
        imagenURL = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error al subir la imagen: ", error);
        setErrorMessage("Error al subir la imagen. Inténtalo de nuevo.");
        return;
      }
    }
  
    const data = {
      ...formData,
      cantidad,
      costo,
      id,
      imagenURL, // Utiliza imagenURL aquí
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
        precioDetalle: "",
        imagenURL: "", // Reiniciar el nuevo campo
      });
      setImageFile(null);
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
                      Marca Automóvil
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
                      {[
                        "Alfa Romeo",
                        "Audi",
                        "BAIC",
                        "BMW",
                        "BYD",
                        "Changan",
                        "Chevrolet",
                        "Chery",
                        "Chrysler",
                        "Citroën",
                        "Dodge",
                        "Dongfeng",
                        "Fiat",
                        "Foton",
                        "Ford",
                        "Geely",
                        "GAC",
                        "Great Wall",
                        "Haval",
                        "Honda",
                        "Hyundai",
                        "JAC",
                        "JMC",
                        "Jeep",
                        "Kia",
                        "Lifan",
                        "Mahindra",
                        "Mazda",
                        "Mercedes-Benz",
                        "MG",
                        "Mini",
                        "Mitsubishi",
                        "Nissan",
                        "Opel",
                        "Peugeot",
                        "Ram",
                        "Renault",
                        "Skoda",
                        "SsangYong",
                        "Subaru",
                        "Suzuki",
                        "Tata",
                        "Toyota",
                        "Volkswagen",
                        "Volvo",
                      ].sort().map((marca) => (
                        <MenuItem key={marca} value={marca}>
                          {marca}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </p>
                <p>
                  <br />
                  <TextField
                    label="Precio Venta"
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
                    label="Precio Detalle"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="precioDetalle"
                    type="text"
                    name="precioDetalle"
                    value={formData.precioDetalle}
                    onChange={handleChange}
                    placeholder="Ejemplo: 15000"
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
                
                <p>
                  <br />
                  <input
                    accept="image/*"
                    type="file"
                    id="imagen"
                    onChange={handleImageChange}
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
