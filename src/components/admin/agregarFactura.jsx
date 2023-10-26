import React, { useState } from 'react';
import { storage, db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  onSnapshot, 
  query, 
  addDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Admin from './admin';

const AgregarFactura = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useState({
    fecha: '',
    proveedor: '',
    detalle: '',
  });

  const handleChangeText = (name, value) => {
    setState({ ...state, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.fecha || !state.proveedor || !state.detalle) {
      alert('Datos incompletos');
    } else {
      try {
        const docRef = await addDoc(collection(db, "facturas"), {
          fecha: state.fecha,
          proveedor: state.proveedor,
          detalle: state.detalle,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      setState({ ...state, fecha: '', proveedor: '', detalle: '' });
    }
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
          alert('Se ha subido el archivo');
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

  return (
    <>
      <Admin />
      <div >
          <div className="contenedor">
            <h1 className="form-title">Agregar Factura</h1>
            <form className=" " onSubmit={handleSubmit}>
              <div className="main-user-info">
                <div className="user-input-box">
                  <label>Fecha</label>
                  <input
                    id="fecha"
                    type="date"
                    name="fecha"
                    placeholder="Fecha"
                    required
                    onChange={(e) => handleChangeText('fecha', e.target.value)}
                    value={state.fecha}
                  />
                </div>
                <div className="user-input-box">
                  <label>Proveedor</label>
                  <input
                    id="proveedor"
                    type="text"
                    name="proveedor"
                    placeholder="Proveedor"
                    required
                    onChange={(e) => handleChangeText('proveedor', e.target.value)}
                    value={state.proveedor}
                  />
                </div>
                <div className="user-input-box">
                  <label>Detalle</label>
                  <input
                    id="detalle"
                    required
                    type="text"
                    name="detalle"
                    placeholder="Detalle"
                    onChange={(e) => handleChangeText('detalle', e.target.value)}
                    value={state.detalle}
                  />
                  </div>
                  <div className="user-input-box">
                    <label>Seleccionar Archivo</label>
                    <input type="file" onChange={handleFileChange} />
                  </div>
              </div>
              <div className="button">
                <button type="submit" onClick={handleUpload} disabled={uploading}>Agregar Fatura</button>
                {uploading && <p>Subiendo Archivo</p> }
              </div>
            </form>
          </div>
        </div> 
    </>
  );
};


export default AgregarFactura;