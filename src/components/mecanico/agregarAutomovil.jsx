import React, { useState, useContext } from "react";
import {
  Typography,
  TextField,
  Button,
  Modal,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Mecanico from "./mecanico";
import { DarkModeContext } from "../../context/darkMode";
import ValidadorPatente from "../../hooks/validadorPatente";
import ValidadorVIN from "../../hooks/validadorVIn";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function AgregarAutomovil() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [color, setColor] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [mensajePatente, setMensajePatente] = useState(null);
  const [mensajePatenteError, setMensajePatenteError] = useState(null);
  const [mensajeVin, setMensajeVin] = useState(null);
  const [mensajeVinError, setMensajeVinError] = useState(null);
  const [numchasis, setNumChasis] = useState("");
  const [patente, setPatente] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isVerificarModalVisible, setVerificarModalVisible] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "marca":
        setMarca(value);
        break;
      case "modelo":
        setModelo(value);
        break;
      case "ano":
        setAno(value);
        break;
      case "color":
        setColor(value);
        break;
      case "kilometraje":
        setKilometraje(value);
        break;
      case "numchasis":
        setNumChasis(value.toUpperCase());
        break;
      case "patente":
        setPatente(value.toUpperCase());
        break;
      default:
        break;
    }
  };

  const showConfirmationModal = () => {
    setConfirmationModalVisible(true);
  };

  const hideConfirmationModal = () => {
    setConfirmationModalVisible(false);
  };

  const showVerificarModal = () => {
    setVerificarModalVisible(true);
  };

  const hideVerificarModal = () => {
    setVerificarModalVisible(false);
  };

  const handleConfirmationAndSave = () => {
    hideConfirmationModal();
    agregarAutomovil();
  };

  const agregarAutomovil = async () => {
    if (
      !marca ||
      !modelo ||
      !ano ||
      !color ||
      !kilometraje ||
      !numchasis ||
      !patente
    ) {
      setErrorMessage("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    try {
      const automovilRef = doc(db, "automoviles", patente);
      const automovilDoc = await getDoc(automovilRef);
      if (automovilDoc.exists()) {
        await setDoc(automovilRef, {
          marca,
          modelo,
          ano,
          color,
          kilometraje,
          numchasis,
          timestamp: serverTimestamp(),
        });
        console.log("Automovil updated with Patente (ID): ", patente);
      } else {
        await setDoc(automovilRef, {
          marca,
          modelo,
          ano,
          color,
          kilometraje,
          numchasis,
          timestamp: serverTimestamp(),
        });
        console.log("New automovil added with Patente (ID): ", patente);
      }

      setMarca("");
      setModelo("");
      setAno("");
      setColor("");
      setKilometraje("");
      setNumChasis("");
      setPatente("");
      setSuccessMessage("Automóvil agregado correctamente");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding/updating automovil: ", error);
      setErrorMessage("Error al agregar el automóvil. Inténtalo de nuevo.");
    }
  };

  const validarPatenteOnChange = () => {
    const patenteInput = document
      .getElementById("patente")
      .value.trim()
      .toUpperCase();
    const validador = new ValidadorPatente(patenteInput);

    if (validador.esValido) {
      setMensajePatente("Patente válida");
      setMensajePatenteError("");
      setTimeout(() => setMensajePatente(""), 2000);
    } else {
      setMensajePatenteError("Patente inválida");
      setMensajePatente("");
      setTimeout(() => setMensajePatenteError(""), 8000);
    }
  };

  const validadarVinOnBlur = () => {
    const vin = numchasis.trim();
    const validador = new ValidadorVIN(vin);

    if (validador.esValido) {
      setMensajeVin("VIN correcto");
      setMensajeVinError("");
      setTimeout(() => setMensajeVin(""), 2000);
    } else {
      setMensajeVinError("VIN incorrecto");
      setMensajeVin("");
      setTimeout(() => setMensajeVinError(""), 8000);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1950; year <= currentYear; year++) {
    years.push(year);
  }

  return (
    <>
      <header>
        <Mecanico />
      </header>
      <div className={`body_formulario ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="formulario_content">
          <div className="formulario_wrapper">
            <div className="formulario_contact">
              <h1
                className={`formulario_titulo ${isDarkMode ? "dark-mode" : ""}`}
              >
                Agregar Automóvil
              </h1>
              <form
                className={`formulario_form ${isDarkMode ? "dark-mode" : ""}`}
              >
                <p>
                  <br />
                  <TextField
                    label="Patente"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="patente"
                    required
                    type="text"
                    name="patente"
                    value={patente}
                    onChange={handleChange}
                    placeholder="Patente"
                    onBlur={validarPatenteOnChange}
                    inputProps={{ maxLength: 6 }}
                  />
                </p>
                {mensajePatente && (
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    {mensajePatente}
                  </Alert>
                )}
                {mensajePatenteError && (
                  <Alert severity="error" icon={<CloseIcon />}>
                    {mensajePatenteError}
                  </Alert>
                )}
                <p>
                  <br />
                  <FormControl sx={{ height: "31px", width: "220px" }}>
                    <InputLabel id="marca-label">Seleccione Marca</InputLabel>
                    <Select
                      labelId="marca-label"
                      id="marca"
                      name="marca"
                      value={marca}
                      label="Seleccione Marca"
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value={"Toyota"}>Toyota</MenuItem>
                      <MenuItem value={"Honda"}>Honda</MenuItem>
                      <MenuItem value={"DS"}>DS</MenuItem>
                      <MenuItem value={"Cupra"}>Cupra</MenuItem>
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
                    label="Modelo"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="modelo"
                    required
                    type="text"
                    name="modelo"
                    value={modelo}
                    onChange={handleChange}
                    placeholder="Modelo"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Kilometro Automóvil"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="kilometraje"
                    required
                    type="text"
                    name="kilometraje"
                    value={kilometraje}
                    onChange={handleChange}
                    placeholder="Kilometro Automóvil"
                  />
                </p>
                <p>
                  <br />
                  <TextField
                    label="Color"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="color"
                    required
                    type="text"
                    name="color"
                    value={color}
                    onChange={handleChange}
                    placeholder="Color"
                  />
                </p>
                <p>
                  <br />
                  <FormControl
                    sx={{ height: "31px", marginTop: "2px", width: "220px" }}
                  >
                    <InputLabel id="ano-label">Seleccione Año</InputLabel>
                    <Select
                      labelId="ano-label"
                      id="ano"
                      name="ano"
                      value={ano}
                      label="Seleccione Año"
                      onChange={handleChange}
                      required
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </p>
                <p>
                  <br />
                  <TextField
                    label="Número  de Chasis"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="numchasis"
                    required
                    type="text"
                    name="numchasis"
                    value={numchasis}
                    onChange={handleChange}
                    onBlur={validadarVinOnBlur}
                    placeholder="Número  de Chasis"
                  />
                </p>{" "}
                {mensajeVin && (
                  <Alert severity="success" icon={<CheckCircleIcon />}>
                    {mensajeVin}
                  </Alert>
                )}
                {mensajeVinError && (
                  <Alert severity="error" icon={<CloseIcon />}>
                    {mensajeVinError}
                  </Alert>
                )}
                <Button
                  onClick={showVerificarModal}
                  variant="outlined"
                  sx={{
                    fontSize: "15px",
                    width: "220px",
                    height: "55px",
                    marginTop: "20px",
                    left: "33px",
                  }}
                >
                  Verificar Automóvil
                </Button>
                <Modal
                  open={isVerificarModalVisible}
                  onClose={hideVerificarModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={modalStyle}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Verificar Automóvil
                    </Typography>
                    <iframe
                      src="https://www.patentechile.com/"
                      width="100%"
                      height="400px"
                      title="Verificar Automóvil"
                      style={{ border: "none", marginTop: "20px" }}
                    />
                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button onClick={hideVerificarModal} variant="outlined">
                        Cerrar
                      </Button>
                    </Box>
                  </Box>
                </Modal>
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
                <Button
                  sx={{
                    fontSize: "20px",
                    width: "350px",
                    marginTop: "19px",
                    alignContent: "center",
                    textAlign: "center",
                    left: "150px",
                  }}
                  variant="outlined"
                  onClick={showConfirmationModal}
                >
                  Agregar Automóvil
                </Button>
                <Modal
                  open={isConfirmationModalVisible}
                  onClose={hideConfirmationModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={modalStyle}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      ¿Estás seguro de que deseas guardar este automóvil?
                    </Typography>
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button
                        onClick={handleConfirmationAndSave}
                        variant="contained"
                      >
                        Sí, Guardar
                      </Button>
                      <Button
                        onClick={hideConfirmationModal}
                        variant="outlined"
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
