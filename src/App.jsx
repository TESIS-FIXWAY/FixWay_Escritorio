import React from "react";
//componets (vistas)
import Login from './components/login';
//admin
// agregar los nombres de las constantes en mayusculas
import Admin from './components/admin/admin';
import AgregarUsuario from './components/admin/agregarUsuario';
import ListarUsuario from "./components/admin/listarUsuario";
import EditarUsuario from "./components/admin/editarUsuario";

//mecanico
import Mecanico from "./components/mecanico/mecanico";

import Error from './components/404';

import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRouter";

function App() {
  return (
      <div className="App">
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path='/admin'
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path='/indexAdmin' element={<indexAdmin />} />
            <Route path='/agregarUsuario' element={<AgregarUsuario />} />
            <Route path='/listarUsuario' element={<ListarUsuario />} />
            <Route path='/editarUsuario' element={<EditarUsuario />} />
            <Route
              path='/mecanico'
              element={
                <ProtectedRoute>
                  <Mecanico />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </AuthContextProvider>
      </div>
  );
}



export default App;
