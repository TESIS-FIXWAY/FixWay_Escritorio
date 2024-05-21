import React from "react";
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
        <div className="editar" style={{ width: "750px" }}>
          <p className="p_editar">Productos Seleccionados</p>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">
                    Nombre del <br /> Producto
                  </th>
                  <th scope="col">Costo</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosSeleccionados.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.nombreProducto}</td>
                    <td>{item.costo}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        style={{ width: "80px" }}
                        value={item.cantidad || 0}
                        onChange={(e) => {
                          const nuevaCantidad =
                            parseInt(e.target.value, 10) || 0;
                          actualizarCantidadManual(item.id, nuevaCantidad);
                        }}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => quitarProducto(item.id)}
                        style={{ backgroundColor: "red" }}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <tfoot>
            <tr>
              <td colSpan="5">
                <button
                  style={{ background: "#E74C3C", marginRight: "10px" }}
                  onClick={() => setProductosSeleccionados([])}
                >
                  Vaciar Lista
                </button>
                <button
                  style={{ background: "#1DC258" }}
                  onClick={toggleProductList}
                >
                  Ocultar listado de productos
                </button>
              </td>
            </tr>
          </tfoot>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
