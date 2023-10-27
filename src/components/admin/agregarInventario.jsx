import React from "react"
import Admin from "./admin"
import { db } from "../../firebase"
import {  
  doc,
  setDoc,
} from "firebase/firestore";

const AgregarInventario = () => {
  
  const submitHandler = async (e) => {
    e.preventDefault()
    const codigoProducto = e.target.codigoProducto.value
    const nombreProducto = e.target.nombreProducto.value
    const descripcion = e.target.descripcion.value
    const cantidad = e.target.cantidad.value
    const costo = e.target.costo.value
    const categoria = e.target.categoria.value
    const marca = e.target.marca.value
    const id = codigoProducto
    const data = {
      codigoProducto,
      nombreProducto,
      descripcion,
      cantidad,
      costo,
      categoria,
      marca,
      id
    }
    await setDoc(doc(db, "inventario", id), data);
    e.target.reset()
  }

  return (
    <>
      <Admin />
        <div className='body_formulario'>
          <div className='formulario_content'>
            <div className='formulario_wrapper'>
              <div className='formulario_contact'>
                <h1 className='formulario_titulo'>Agregar Usuario</h1>
                <form className="formulario_form"onSubmit={submitHandler}>
                  <p>
                    <label className='label_formulario'>Codigo Producto</label>
                    <br />
                    <input
                      className='input_formulario'
                      id="codigoProducto"
                      type="text"
                      name="codigoProducto"
                      placeholder="Codigo Producto"
                      required
                    />
                  </p>
                  <p>
                    <label className='label_formulario'>Nombre Producto</label>
                    <br />
                    <input
                      className='input_formulario'
                      id="nombreProducto"
                      type="text"
                      name="nombreProducto"
                      placeholder="Nombre Producto"
                      required/>
                  </p>
                  <p>
                    <label className='label_formulario'>Descripcion</label>                  
                    <br />
                    <input
                      className='input_formulario'
                      id="descripcion"
                      required
                      type="text"
                      name="descripcion"
                      placeholder="Descripcion"/>
                  </p>
                  <p>
                    <label className='label_formulario'>Cantidad</label>
                    <br />
                    <input
                      className='input_formulario'
                      id="cantidad"
                      required
                      type="text"
                      name="cantidad"
                      placeholder="Cantidad"/>
                  </p>
                  <p>
                    <label className='label_formulario'>Costo</label>
                    <br />
                    <input
                      className='input_formulario'
                      id="costo"
                      required
                      type="text"
                      name="costo"
                      placeholder="Costo"/>
                  </p>
                  <p>
                    <label className='label_formulario'>Categoria</label>
                    <br />
                    <input
                      className='input_formulario'
                      id="categoria"
                      required
                      type="text"
                      name="categoria"
                      placeholder="Categoria"/>
                  </p>
                  <p>
                    <label className='label_formulario'>Marca</label>
                    <br />
                    <input
                      className='input_formulario'
                      id="marca"
                      required
                      type="text"
                      name="marca"
                      placeholder="Marca"/>
                  </p>
                  <p className='block_boton'>
                    <button type="submit" className='boton_formulario'>
                      Agregar
                    </button>
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