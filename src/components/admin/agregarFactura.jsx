// Este componente AgregarFactura maneja la interfaz y lógica para agregar una factura en la aplicación. 
// Permite al usuario ingresar información como la fecha, el proveedor, el detalle y adjuntar un archivo. 
// Utiliza Firebase para almacenar el archivo en la nube y guarda los detalles de la factura en la base de datos. 
// También renderiza el componente Admin para proporcionar la estructura general de la página de administración. 

// Funciones y características principales: 
// Manejo de formularios para ingresar detalles de la factura. 
// Subida de archivos a Firebase Storage y obtención de la URL de descarga. 
// Almacenamiento de detalles de la factura en Firebase Firestore. 
// Uso del componente Admin para estructurar la página de administración. 
// Validación de datos antes de la subida y almacenamiento. 

import React, { useState } from 'react';
import { storage, db } from '../../firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Admin from '../admin/admin';



const AgregarFactura = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [state, setState] = useState({
    fecha: '',
    proveedor: '',
    detalle: '',
    url: '',
  });

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No se ha seleccionado ningún archivo.');
      return;
    }
    try {
      setUploading(true);
      const storageRef = ref(storage, `facturas/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progreso de la subida: ${progress}%`);
          setMensaje('Se ha subido el archivo');
        },
        (error) => {
          console.error('Error al subir el archivo:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('URL del archivo subido:', downloadURL);
        }
      );
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.fecha || !state.proveedor || !state.detalle) {
      setMensaje('Datos incompletos');
    } else {
      try {
        const timestampNow = serverTimestamp();
        await handleUpload();
        const storageRef = ref(storage, `facturas/${file.name}`);
        const downloadURL = await getDownloadURL(storageRef);
        const docRef = await addDoc(collection(db, "facturas"), {
          fecha: state.fecha,
          proveedor: state.proveedor,
          detalle: state.detalle,
          timestamp: timestampNow,
          url: downloadURL,
        });
        console.log("Documento escrito con ID: ", docRef.id);
        setMensaje('Se ha guardado correctamente');
      } catch (e) {
        console.error("Error al agregar el documento: ", e);
      } finally {
        setState({ ...state, fecha: '', proveedor: '', detalle: '' });
      }
    }
  }

  return (
    <>
      <Admin />
      <div >
          <div className="body_formulario">
            <div className='formulario_content'>
              <div className='formulario_wrapper'>
                <div className='formulario_contact'>
                  <h1 className="formulario_titulo">Agregar Factura</h1>
                  <form className="formulario_form" onSubmit={handleSubmit}>
                    <p>
                      <label className='label_formulario'>Fecha</label>
                      <br />
                      <input
                        id="fecha"
                        type="date"
                        name="fecha"
                        placeholder="Fecha"
                        className='input_formulario'
                        required
                        onChange={(e) => handleChangeText('fecha', e.target.value)}
                        value={state.fecha}
                      />
                    </p>
                    <p>
                      <label className='label_formulario'>Proveedor</label>
                      <br />
                      <input
                        id="proveedor"
                        type="text"
                        name="proveedor"
                        placeholder="Proveedor"
                        className='input_formulario'
                        required
                        onChange={(e) => handleChangeText('proveedor', e.target.value)}
                        value={state.proveedor}
                      />
                    </p>
                    <p>
                      <label className='label_formulario'>Detalle</label>
                      <br />
                      <input
                        id="detalle"
                        required
                        type="text"
                        className='input_formulario'
                        name="detalle"
                        placeholder="Detalle"
                        onChange={(e) => handleChangeText('detalle', e.target.value)}
                        value={state.detalle}
                      />
                      </p>
                      <p>
                        <label className='label_formulario'>Seleccionar Archivo</label>
                        <br />
                        <input type="file" onChange={handleFileChange} required className='input_formulario'/>
                      </p>
                      {mensaje && <p className="mensaje">{mensaje}</p>}
                      <p className="block_boton">
                        <button type="submit" disabled={uploading} className='boton_formulario' >Agregar Fatura</button>
                        {uploading && <p>Subiendo Archivo</p> }
                      </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div> 
    </>
  );
};

export default AgregarFactura;