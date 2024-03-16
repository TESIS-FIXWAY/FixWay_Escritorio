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
    try {
      e.preventDefault();
      const { fecha, proveedor, detalle } = state;
      if (!fecha || !proveedor || !detalle) {
        setMensaje('Datos incompletos');
        return;
      }

      const timestampNow = serverTimestamp();
      await handleUpload();
      if (!file) {
        setMensaje('Error al subir el archivo');
        return;
      }
      
      const storageRef = ref(storage, `facturas/${file.name}`);
      const downloadURL = await getDownloadURL(storageRef);
      const docRef = await addDoc(collection(db, "facturas"), {
        fecha,
        proveedor,
        detalle,
        timestamp: timestampNow,
        url: downloadURL,
      });
  
      console.log("Documento escrito con ID:", docRef.id);
      setMensaje('Se ha guardado correctamente');
    } catch (error) {
      console.error("Error al agregar el documento:", error);
      setMensaje('Ha ocurrido un error al guardar');
    } finally {
      setState({ fecha: '', proveedor: '', detalle: '' });
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
                  <h1 className="formulario_titulo">Agregar Factura Proveedor</h1>
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
