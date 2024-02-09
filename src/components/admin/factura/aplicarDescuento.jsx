import React from "react";

export default function AplicarDescuento ({ showDiscountMenu, descuentoMenuValue, handleDescuentoChange, aplicarDescuento, cancelarDescuento }) {
  if (showDiscountMenu) {
      return (
          <div className="fondo_no">
              <div className="editar" style={{ width: '413px' }}>
                  <div className="descuento-menu">
                      <input
                          type="text"
                          placeholder="Descuento (%)"
                          value={descuentoMenuValue}
                          onChange={handleDescuentoChange}
                      />
                      <button onClick={aplicarDescuento} style={{ background: "#1DC258" }}> Aplicar Descuento</button>
                      <button onClick={cancelarDescuento} style={{ background: "#E74C3C" }}>Cancelar Descuento</button>
                  </div>
              </div>
          </div>
      );
  } else {
      return null;
  }
};
