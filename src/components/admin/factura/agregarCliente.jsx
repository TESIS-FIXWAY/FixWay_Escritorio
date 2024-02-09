import React from 'react';

export default function AgregarCliente ({ showAgregarCliente, clienteNombre, clienteApellido, clienteRut, clienteEmail, clienteTelefono, setClienteNombre, setClienteApellido, setClienteRut, setClienteEmail, setClienteTelefono, agregarCliente, toggleAgregarCliente, mensajeRut, validarRutOnChange }) {
    if (showAgregarCliente) {
        return (
            <div className="fondo_no">
                <div className="editar" style={{ width: "413px" }}>
                    <div className="descuento-menu">
                        <input
                            type="text"
                            placeholder="Nombre"
                            id="nombre"
                            value={clienteNombre}
                            onChange={(e) => setClienteNombre(e.target.value)}
                        />
                        <input
                            type="text"
                            id="apellido"
                            placeholder="Apellido"
                            value={clienteApellido}
                            onChange={(e) => setClienteApellido(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Rut (11.111.111-1)"
                            value={clienteRut}
                            id="rut"
                            onChange={(e) => setClienteRut(e.target.value)}
                            onBlur={validarRutOnChange}
                        />
                        <p className='mensaje_rut'>{mensajeRut}</p>
                        <input
                            type="text"
                            placeholder="Email"
                            id="email"
                            value={clienteEmail}
                            onChange={(e) => setClienteEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Ejemplo: +56 9 12345678"
                            pattern="[+]56 [0-9]{1} [0-9]{8}"
                            id="telefono"
                            value={clienteTelefono}
                            onChange={(e) => setClienteTelefono(e.target.value)}
                        />
                        <button onClick={agregarCliente} style={{ background: "#1DC258" }}>
                            Agregar Cliente
                        </button>
                        <button onClick={toggleAgregarCliente} style={{ background: "#E74C3C" }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
};
