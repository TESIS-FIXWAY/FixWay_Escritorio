import React, { useState } from "react";


const ListadoFacturas = () => {
  
  return (
    <div className="container">
      <h1>Listado de Facturas</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id}>
              <td>{factura.id}</td>
              <td>{factura.fecha}</td>
              <td>{factura.cliente}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => mostrarModalFactura(factura)}
                >
                  Ver Detalle
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => eliminarFactura(factura.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mostrarModal && (
        <ModalFactura
          factura={facturaSeleccionada}
          setMostrarModal={setMostrarModal}
        />
      )}
    </div>
  );
}

export default ListadoFacturas;