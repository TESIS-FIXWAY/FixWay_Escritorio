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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Mecanico from "./mecanico";
import { DarkModeContext } from "../../context/darkMode";

function AgregarAutomovil() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [color, setColor] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [numchasis, setNumChasis] = useState("");
  const [patente, setPatente] = useState("");
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const navigate = useNavigate();
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
        setNumChasis(value);
        break;
      case "patente":
        setPatente(value);
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

  const handleConfirmationAndSave = () => {
    hideConfirmationModal();
    agregarAutomovil();
  };

  const agregarAutomovil = async () => {
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
      alert("Automovil agregado correctamente");
      navigate("Agregar Mantencion");
    } catch (error) {
      console.error("Error adding/updating automovil: ", error);
    }
  };

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
                  />
                </p>
                <p>
                  <br />
                  <FormControl
                    sx={{ height: "30px", marginTop: "10px", width: "260px" }}
                  >
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
                  <TextField
                    label="Año"
                    variant="outlined"
                    className={`input_formulario ${
                      isDarkMode ? "dark-mode" : ""
                    }`}
                    id="año"
                    required
                    type="number"
                    name="año"
                    value={ano}
                    onChange={handleChange}
                    placeholder="Año"
                  />
                </p>
              </form>
              <Button variant="contained" onClick={showConfirmationModal}>
                Agregar Automóvil
              </Button>
              <Modal
                open={isConfirmationModalVisible}
                onClose={hideConfirmationModal}
              >
                <div>
                  <Typography variant="h6">
                    ¿Estás seguro de que deseas guardar este automóvil?
                  </Typography>
                  <Button onClick={handleConfirmationAndSave}>
                    Sí, Guardar
                  </Button>
                  <Button onClick={hideConfirmationModal}>Cancelar</Button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AgregarAutomovil;
