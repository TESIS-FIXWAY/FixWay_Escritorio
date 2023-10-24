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
    email: '',
    password: '',
    salario: '',
  });
  const [user, setUser] = useState({});


  React.useEffect(() => { const collectionRef = collection(db, "users");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {setUser(querySnapshot.docs.map((doc) => ({ id: doc.id })));});
    return unsubscribe; }, []);
  let id = "";
  user.map((user) => {id = user.id});

  const onEdit = () => {
    const docRef = doc(db, "users", id);
    updateDoc(docRef, {
      rol: state.rol,
      nombre: state.nombre,
      apellido: state.apellido,
      telefono: state.telefono,
      direccion: state.direccion,
      email: state.email,
      password: state.password,
      salario: state.salario,
  })};

  // const onEdit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const docRef = doc(db, "users", user.id);
  //     const payload = {
  //       rol: state.rol,
  //       nombre: state.nombre,
  //       apellido: state.apellido,
  //       telefono: state.telefono,
  //       direccion: state.direccion,
  //       email: state.email,
  //       password: state.password,
  //       salario: state.salario,
  //     };
  //     await updateDoc(docRef, payload);
  //     console.log('Usuario actualizado correctamente.');
  //     navigate('/listarUsuario');
  //   } catch (error) {
  //     console.error('Error al actualizar el usuario:', error);
  //   }
  // }

  const handleChangeTexte = (name, value) => {
    setState({ ...state, [name]: value });
  }

  // const rellenarCampos = async () => {
  //   const q = query(collection(db, "users"));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     if (doc.id === localStorage.getItem('id')) {
  //       setUser({
  //         id: doc.id,
  //         rol: doc.data().rol,
  //         nombre: doc.data().nombre,
  //         apellido: doc.data().apellido,
  //         telefono: doc.data().telefono,
  //         direccion: doc.data().direccion,
  //         email: doc.data().email,
  //         password: doc.data().password,
  //         salario: doc.data().salario,
  //       });
  //       setState({
  //         rol: doc.data().rol,
  //         nombre: doc.data().nombre,
  //         apellido: doc.data().apellido,
  //         telefono: doc.data().telefono,
  //         direccion: doc.data().direccion,
  //         email: doc.data().email,
  //         password: doc.data().password,
  //         salario: doc.data().salario,
  //       });
  //     }
  //   });
  // }

  const reloadList = () => {
    navigate('/listarUsuario');
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
                onChange={(event) => handleChangeTexte("email", event.target.value)}
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
          <button type="submit" onClick={reloadList}>Guardar Datos</button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;