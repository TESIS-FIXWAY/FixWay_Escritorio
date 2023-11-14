import React, { useState } from "react";
//componets (vistas)
import Login from './components/login';
import LoadingScreen from "./components/loadingScreen";
//admin
// agregar los nombres de las constantes en mayusculas
import Admin from './components/admin/admin';
import IndexAdmin from "./components/admin/indexAdmin";
import AgregarUsuario from './components/admin/agregarUsuario';
import ListarUsuario from "./components/admin/listarUsuario";
import AgregarFactura from "./components/admin/agregarFactura";
import ListadoFacturas from "./components/admin/listadoFacturas";
import AgregarInventario from "./components/admin/agregarInventario";
import ListarInventario from "./components/admin/listarInventario";
import GenerarFactura from "./components/admin/generarFactura";

//mecanico
import Mecanico from "./components/mecanico/mecanico";
import IndexMecanico from "./components/mecanico/indexMecanico";
import GestionMantenciones from "./components/mecanico/gestionMantenciones";
import ListarInventarioMecanico from "./components/mecanico/listarInventarioMecanico";
import GenerarQR from "./components/mecanico/GenerarQR";

import Error from './components/404';

import { Routes, Route} from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRouter";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
      <div className="App">
        {isLoading ? (
          <LoadingScreen />
        ) : (
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
              <Route path='/indexAdmin' element={<IndexAdmin />} />
              <Route path='/agregarUsuario' element={<AgregarUsuario />} />
              <Route path='/listarUsuario' element={<ListarUsuario />} />
              <Route path='/agregarFactura' element={<AgregarFactura />} />
              <Route path='/listadoFacturas' element={<ListadoFacturas />} />
              <Route path='/agregarInventario' element={<AgregarInventario />} />
              <Route path='/listarInventario' element={<ListarInventario />} />
              <Route path='/generarFactura' element={<GenerarFactura />} />
              <Route
                path='/mecanico'
                element={
                  <ProtectedRoute>
                    <Mecanico />
                  </ProtectedRoute>
                }
              />
              <Route path='/indexMecanico' element={<IndexMecanico />} />
              <Route path='/gestionMantenciones' element={<GestionMantenciones />} />
              <Route path='/listarInventarioMecanico' element={<ListarInventarioMecanico/>}/>
              <Route path='/generarQR' element={<GenerarQR/>}/>
              <Route path="*" element={<Error />} />
            </Routes>
          </AuthContextProvider>
        )}
      </div>
  );
}

export default App;
