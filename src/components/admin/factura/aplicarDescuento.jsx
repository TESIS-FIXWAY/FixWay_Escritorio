import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AplicarDescuento({
  showDiscountMenu,
  descuentoMenuValue,
  handleDescuentoChange,
  aplicarDescuento,
  cancelarDescuento,
}) {
  if (showDiscountMenu) {
    return (
      <div className="fondo_no">
        <div className="editar" style={{ width: "300px" }}>
          <div className="descuento-menu">
            <input
              type="text"
              placeholder="Descuento (%)"
              value={descuentoMenuValue}
              onChange={handleDescuentoChange}
            />
            <button
              onClick={aplicarDescuento}
              style={{ background: "#1DC258" }}
            >
              Aplicar <FontAwesomeIcon icon="fa-solid fa-check" />
            </button>
            <button
              onClick={cancelarDescuento}
              style={{ background: "#E74C3C" }}
            >
              Cancelar <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
