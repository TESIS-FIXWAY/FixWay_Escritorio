import React, { useState } from "react";
import Admin from "./admin";
import { db } from "../../firebase";
import { collection, getDocs, onSnapshot, query, addDoc, doc } from "firebase/firestore";


const ListarUsuario = () => {

  const [users, setUsers] = useState([]);

  React.useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          rut: doc.data().rut,
          rol: doc.data().rol,
          nombre: doc.data().nombre,
          apellido: doc.data().apellido,
          direccion: doc.data().direccion,
          telefono: doc.data().telefono,
        });
      });
      setUsers(users);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Admin />


<div className="contenedor-tabla">
  <table className="tabla">

    <caption>Listado de Usuarios</caption>
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        <th scope="col">Apellido</th>
        <th scope="col">Direccion</th>
        <th scope="col">Telefono</th>
        <th scope="col">Cargo de trabajo</th>
        <th scope="col">Salario</th>
      </tr>
    </thead>

    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.nombre}</td>
          <td>{user.apellido}</td>
          <td>{user.direccion}</td>
          <td>{user.telefono}</td>
          <td>{user.cargoTrabajo}</td>
          <td>{user.salario}</td>
        </tr>
      ))}
    </tbody>

  </table>
</div>
    </>
  );
};

export default ListarUsuario;