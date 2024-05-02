import React, { useState } from "react";  
import Admin from "./admin";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const AgregarInventario = () => {
  const [cantidadFormateada, setCantidadFormateada] = useState(""); 

  const submitHandler = async (e) => {
    e.preventDefault();
    const codigoProducto = e.target.codigoProducto.value;
    const nombreProducto = e.target.nombreProducto.value;
    const descripcion = e.target.descripcion.value;
    const cantidad = e.target.cantidad.value.replace(/[^0-9]/g, "");
    const costo = Number(e.target.costo.value).toLocaleString("es-CL"); 
    const categoria = e.target.categoria.value;
    const marca = e.target.marca.value;
    const id = codigoProducto;

    const data = {
      codigoProducto,
      nombreProducto,
      descripcion,
      cantidad,
      costo, 
      categoria,
      marca,
      id,
    };
    await setDoc(doc(db, "inventario", id), data);
    e.target.reset();
  };

  const handleCantidadChange = (e) => {
    const cantidad = e.target.value.replace(/[^0-9]/g, "");
    const cantidadFormateada = cantidad.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setCantidadFormateada(cantidadFormateada);
  };

  return (
    <>
      <Admin />
        <div className='body_formulario'>

          <div className='formulario_content'>

            <div className='formulario_wrapper'>

              <div className='formulario_contact'>

                <h1 className='formulario_titulo'>Agregar Inventario</h1>

                <form className="formulario_form"onSubmit={submitHandler}>
                  <p>
                    <br />
                      <TextField label="Código Producto" variant="outlined" className="input_formulario"
                        id="codigoProducto"
                        required
                        type="text"
                        name="codigoProducto"
                        placeholder="Codigo Producto"
                      />
                  </p>

                  <p>
                    <br />
                    <TextField label="Nombre Producto" variant="outlined" className="input_formulario"
                      id="nombreProducto"
                      required
                      type="text"
                      name="nombreProducto"
                      placeholder="Nombre Producto"
                    />
                  </p>
   
                  <p>
                    <br />
                    <TextField label="Descripcion" variant="outlined" className="input_formulario"
                      id="descripcion"
                      required
                      type="text"
                      name="descripcion"
                      placeholder="Descripcion"
                    />
                  </p>

                  <p>
                    <br />
                    <TextField label="Cantidad" variant="outlined" className="input_formulario"
                      id="cantidad"
                      required
                      type="text"
                      name="cantidad"
                      placeholder="Cantidad"
                      value={cantidadFormateada}
                      onChange={handleCantidadChange} 
                    />
                  </p>

                  <p>
                    <br />
                    <TextField label="costo" variant="outlined" className="input_formulario"
                      id="costo"
                      required
                      type="text"
                      name="costo"
                      placeholder="ejemplo: 10000"
                    />
                  </p>

                  <p>
                    <label className='label_formulario'>Categoría</label>
                    <br />
                    <select
                      className='input_formulario'
                      id="categoria"
                      required
                      name="categoria"
                    >
                      <option value="" disabled selected>
                        Seleccione una categoría
                      </option>
                      <option value="Sistema de Suspensión">Sistema de Suspensión</option>
                      <option value="Afinación del Motor">Afinación del Motor</option>
                      <option value="Sistema de Inyección Electrónica">Sistema de Inyección Electrónica</option>
                      <option value="Sistema de Escape">Sistema de Escape</option>
                      <option value="Sistema de Climatización">Sistema de Climatización</option>
                      <option value="Sistema de Lubricación">Sistema de Lubricación</option>
                      <option value="Sistema de Dirección">Sistema de Dirección</option>
                      <option value="Sistema de Frenos">Sistema de Frenos</option>
                      <option value="Sistema de Encendido">Sistema de Encendido</option>
                      <option value="Inspección de Carrocería y Pintura">Inspección de Carrocería y Pintura</option>
                      <option value="Sistema de Transmisión">Sistema de Transmisión</option>
                      <option value="Sistema de Refrigeración">Sistema de Refrigeración</option>
                      <option value="Accesorios y Personalización">Accesorios y Personalización</option>
                      <option value="Herramientas y Equipos">Herramientas y Equipos</option>
                    </select>
                  </p>

                  <p>
                    <br />
                    <TextField label="Marca" variant="outlined" className="input_formulario"
                      id="marca"
                      required
                      type="text"
                      name="marca"
                      placeholder="Marca"
                    />
                  </p>

                  <p className='block_boton'>
                    <Button variant="contained" className="boton_formulario" type="submit">
                      Agregar
                    </Button> 
                  </p>


                </form>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default AgregarInventario