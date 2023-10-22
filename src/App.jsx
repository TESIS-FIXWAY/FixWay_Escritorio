import React from "react";
//componets (vistas)
import Login from './components/login';
//admin
import Admin from './components/admin/admin';
import AgregarUsuario from './components/admin/agregarUsuario';
import ListarUsuario from "./components/admin/listarUsuario";

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
            <Route path='/agregarUsuario' element={<AgregarUsuario />} />
            <Route path='/listarUsuario' element={<ListarUsuario />} />
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
