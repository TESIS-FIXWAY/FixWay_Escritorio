import React, { useState } from 'react';
import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  onSnapshot, 
  query, 
  addDoc, 
  doc, 
  updateDoc 
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const EditarUsuario = () => {
  const navigate = useNavigate(); 
  const [state, setState] = useState({
    rol: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    salario: '',
    password: '',
  });
  const [user, setUser] = useState([]);
  
  

  React.useEffect(() => {
    const obtenerDatos = async () => {
      const datos = await getDocs(query(collection(db, "users")));
      const arrayDatos = datos.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUser(arrayDatos);
    };
    obtenerDatos();
  }, [user]);
  
  const onEdit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "users", id), {
      rol: state.rol,
      nombre: state.nombre,
      apellido: state.apellido,
      telefono: state.telefono,
      direccion: state.direccion,
      salario: state.salario,
      password: state.password,
    });
    navigate('/listarUsuario');
  }

  const handleChangeTexte = (name, value) => {
    setState({ ...state, [name]: value });
  }

  let id = localStorage.getItem('id');
  user.map((user) => id = user.id);

  
  const rellenarCampos = () => {
    user.map((user) => {
      if (user.id === id) {
        setState({
          rol: user.rol,
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: user.telefono,
          direccion: user.direccion,
          salario: user.salario,
          email: user.email,
          password: user.password,
        });
      }
    });
  }

  
  return (
    <div>
      <h1>Editar Usuario</h1>
      <button onClick={rellenarCampos}>Visualizar Datos</button>
      <form onSubmit={onEdit}>
        <div className="main-user-info">
          <div className="user-input-box">
            <label>ROL</label>
            <input
              id="rol"
              type="text"
              name="rol"
              placeholder="ROL"
              value={state.rol}
              onChange={(e) => handleChangeTexte("rol", e.target.value)}
              required
            />
          </div>
          <div className="user-input-box">
            <label>nombre</label>
            <input
              id="nombre"
              required
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={state.nombre}
              onChange={(e) => handleChangeTexte("nombre", e.target.value)}
              />
            </div>
            <div className="user-input-box">
              <label>apellido</label>
              <input
                id="apellido"
                required
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={state.apellido}
                onChange={(e) => handleChangeTexte("apellido", e.target.value)}
                />
            </div>
            <div className="user-input-box">
              <label>telefono</label>
              <input
                id="telefono"
                required
                type="text"
                name="telefono"
                placeholder="Telefono"
                value={state.telefono}
                onChange={(e) => handleChangeTexte("telefono", e.target.value)}
              />
            </div>
            <div className="user-input-box">
              <label>direccion</label>
              <input
                id="direccion"
                required
                type="text"
                name="direccion"
                placeholder="Direccion"
                value={state.direccion}
                onChange={(e) => handleChangeTexte("direccion", e.target.value)}
              />
            </div>
            <div className="user-input-box">
              <label>email</label>
              <input
                id="email"
                required
                type="text"
                name="email"
                placeholder="Correo"
                value={state.email}
                onChange={(e) => handleChangeTexte("email", e.target.value)}
              />
            </div>
            <div className="user-input-box">
              <label>Contraseña</label>
              <input
                id="password"
                required
                type="text"
                name="password"
                placeholder="Contraseña"
                value={state.password}
                onChange={(e) => handleChangeTexte("password", e.target.value)}
              />
            </div>
            <div className="user-input-box">
              <label>Salario</label>
              <input
                id="salario"
                required
                type="text"
                name="salario"
                placeholder="Salario"
                value={state.salario}
                onChange={(e) => handleChangeTexte("salario", e.target.value)}
              />
            </div>
        </div>
        <div className="button">
          <button type="submit">Guardar Datos</button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;