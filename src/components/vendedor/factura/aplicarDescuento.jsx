import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

export default function AplicarDescuento({
  showDiscountMenu,
  descuentoMenuValue,
  handleDescuentoChange,
  aplicarDescuento,
  cancelarDescuento,
}) {
  if (showDiscountMenu) {
    return (
      <div
        className="fondo_no"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper elevation={3} style={{ width: "300px", padding: "20px" }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <TextField
              label="Descuento (%)"
              variant="outlined"
              value={descuentoMenuValue}
              onChange={handleDescuentoChange}
              fullWidth
            />
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button
                onClick={aplicarDescuento}
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
              >
                Aplicar
              </Button>
              <Button
                onClick={cancelarDescuento}
                variant="contained"
                color="error"
                startIcon={<ClearIcon />}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </div>
    );
  } else {
    return null;
  }
}
