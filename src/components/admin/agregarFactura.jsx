import React, { useState } from 'react';
import { storage } from '../../firebase';
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
      {/* <Admin /> */}
      <div  className="contenedor">
        <h1 className="form-title">Agregar Usuario</h1>
        <div className="form-container">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={uploading} >
            Subir PDF
          </button>
          {uploading && <p>Subiendo Archivo</p> }
        </div>
      </div>
    </>
  );
};


export default AgregarFactura;