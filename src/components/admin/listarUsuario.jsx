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
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center">Listado de Usuarios</h1>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Direccion</th>
                  <th scope="col">Telefono</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.rut}</td>
                    <td>{user.rol}</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.direccion}</td>
                    <td>{user.telefono}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListarUsuario;