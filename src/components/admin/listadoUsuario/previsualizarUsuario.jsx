import React, { useState, useContext } from "react";
import { DarkModeContext } from "../../../context/darkMode";
import "../../styles/previsualizarUsuario.css";
import "../../styles/listarUsuario.css";
import "../../styles/darkMode.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const PrevisualizarUsuario = ({ user, onSave, onCancel, onInputChange }) => {
  const [editing, setEditing] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const handleInputChange = (name, value) => {
    onInputChange(user.id, name, value);
  };

  const handleEdit = () => {
    toggleEdit();
  };

  const translateRol = (rol) => {
    switch (rol) {
      case "administrador":
        return "Administrador";
      case "mecanico":
        return "Mecánico";
      default:
        return rol;
    }
  };

  const formatoDinero = (amount) => {
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  return (
    <div>
      <div
        className={`fondo_no ${isDarkMode ? "dark-mode" : ""}`}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          margin: 0,
          padding: 0,
        }}
      >
        {editing ? (
          <Paper elevation={3} style={{ width: "500px", padding: "20px" }}>
            <Typography
              variant="h5"
              className={`formulario_titulo ${isDarkMode ? "dark-mode" : ""}`}
            >
              Editar Usuario
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                value={user.rol}
                onChange={(e) => handleInputChange("rol", e.target.value)}
              >
                <MenuItem value="mecanico">Mecánico</MenuItem>
                <MenuItem value="administrador">Administrador</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Nombre"
              value={user.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Apellido"
              value={user.apellido}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Teléfono"
              value={user.telefono}
              onChange={(e) => handleInputChange("telefono", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Dirección"
              value={user.direccion}
              onChange={(e) => handleInputChange("direccion", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Sueldo"
              value={user.salario}
              onChange={(e) => handleInputChange("salario", e.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fecha de Ingreso"
              type="date"
              value={user.fechaIngreso}
              onChange={(e) =>
                handleInputChange("fechaIngreso", e.target.value)
              }
              variant="outlined"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              marginTop="16px"
            >
              <Button
                onClick={() => {
                  onSave(user.id, {
                    nombre: user.nombre,
                    apellido: user.apellido,
                    telefono: user.telefono,
                    direccion: user.direccion,
                    salario: user.salario,
                    fechaIngreso: user.fechaIngreso,
                  });
                  toggleEdit();
                }}
                variant="outlined"
                startIcon={<CheckIcon />}
                sx={{ color: "white", backgroundColor: "green" }}
              >
                Guardar
              </Button>
              <Button
                onClick={toggleEdit}
                variant="outlined"
                startIcon={<CloseIcon />}
                sx={{ color: "white", backgroundColor: "red" }}
              >
                Cancelar
              </Button>
            </Box>
          </Paper>
        ) : (
          <>
            <Paper
              elevation={2}
              style={{ padding: "20px", width: "500px", fontSize: "13px" }}
              className={isDarkMode ? "dark-mode" : ""}
            >
              <Typography
                variant="h4"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
              >
                Previsualización de Usuario
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
                sx={{ fontSize: "18px" }}
              >
                <strong>Rol:</strong> {translateRol(user.rol)}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
                sx={{ fontSize: "18px" }}
              >
                <strong>Nombre:</strong> {user.nombre} {user.apellido}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
                sx={{ fontSize: "18px" }}
              >
                <strong>Teléfono:</strong> {user.telefono}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
                sx={{ fontSize: "18px" }}
              >
                <strong>Correo Electrónico:</strong> {user.email}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
                sx={{ fontSize: "18px" }}
              >
                <strong>Dirección:</strong> {user.direccion}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
                sx={{ fontSize: "18px" }}
              >
                <strong>Sueldo:</strong> $ {formatoDinero(user.salario)}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                className={isDarkMode ? "dark-mode" : ""}
                sx={{ fontSize: "18px" }}
              >
                <strong>Fecha de Ingreso:</strong> {user.fechaIngreso}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                marginTop="16px"
              >
                <Button
                  onClick={handleEdit}
                  startIcon={<EditIcon />}
                  variant="outlined"
                  sx={{ color: "white" }}
                  className={` ${isDarkMode ? "dark-mode blue" : ""}`}
                >
                  Editar
                </Button>
                <Button
                  onClick={onCancel}
                  startIcon={<CloseIcon />}
                  variant="outlined"
                  sx={{ color: "white" }}
                  className={` ${isDarkMode ? "dark-mode red" : ""}`}
                >
                  Cerrar
                </Button>
              </Box>
            </Paper>
          </>
        )}
      </div>
    </div>
  );
};

export default PrevisualizarUsuario;
