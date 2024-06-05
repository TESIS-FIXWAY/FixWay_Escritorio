import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function ListadoProductos({
  showProductList,
  productosSeleccionados,
  actualizarCantidadManual,
  quitarProducto,
  setProductosSeleccionados,
  toggleProductList,
}) {
  if (showProductList) {
    return (
      <div className="fondo_no">
        <div className="editar" style={{ width: "950px" }}>
          <p className="p_editar">Productos Seleccionados</p>
          <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre del Producto</TableCell>
                  <TableCell>Costo</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosSeleccionados.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nombreProducto}</TableCell>
                    <TableCell>{item.costo}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        inputProps={{ min: 0, style: { width: "80px" } }}
                        value={item.cantidad || 0}
                        onChange={(e) => {
                          const nuevaCantidad =
                            parseInt(e.target.value, 10) || 0;
                          actualizarCantidadManual(item.id, nuevaCantidad);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => quitarProducto(item.id)}
                        variant="contained"
                        sx={{ color: "white" }}
                      >
                        Quitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Button
              style={{ background: "#E74C3C", color: "#fff" }}
              variant="contained"
              onClick={() => setProductosSeleccionados([])}
            >
              Vaciar Lista
            </Button>
            <Button
              style={{ background: "#1DC258", color: "#fff" }}
              variant="contained"
              onClick={toggleProductList}
            >
              Ocultar listado de productos
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
