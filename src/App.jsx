// Componente App:
// Este componente React sirve como el componente principal de la aplicación.
// Configura las rutas y organiza la estructura general de la aplicación.

// Funciones y Características Principales:
// - Utiliza React Router para gestionar las rutas y la navegación en la aplicación.
// - Utiliza un componente `LoadingScreen` para mostrar una pantalla de carga mientras se carga la aplicación.
// - Envuelve las rutas relacionadas con el administrador y el mecánico en el componente `ProtectedRoute` para asegurar que solo los usuarios autenticados tengan acceso.
// - Configura las rutas para diferentes componentes, incluyendo páginas de inicio de sesión, vistas de administrador y mecánico, y una página de error 404.



import React, { useState } from "react";
//componets (vistas)
import Login from './components/login';
import LoadingScreen from "./components/loadingScreen";
//admin
import Admin from './components/admin/admin';
import IndexAdmin from "./components/admin/indexAdmin";
import AgregarUsuario from './components/admin/agregarUsuario';
import ListarUsuario from "./components/admin/listarUsuario";
import AgregarFactura from "./components/admin/agregarFactura";
import ListadoFacturas from "./components/admin/listadoFacturas";
import AgregarInventario from "./components/admin/agregarInventario";
import ListarInventario from "./components/admin/listarInventario";
import GenerarFactura from "./components/admin/generarFactura";
import GestionMantencionesAdmin from "./components/admin/gestionMantencionAdmin";
import ClienteVista from "./components/admin/clienteVista";

//mecanico
import Mecanico from "./components/mecanico/mecanico";
import IndexMecanico from "./components/mecanico/indexMecanico";
import GestionMantenciones from "./components/mecanico/gestionMantenciones";
import ListarInventarioMecanico from "./components/mecanico/listarInventarioMecanico";
import GenerarQR from "./components/mecanico/GenerarQR";
import GenerarListadoMantencion from "./components/mecanico/generarListadoMantencion";

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
            <Route path='/gestionMantencionesAdmin' element={<GestionMantencionesAdmin />} />
            <Route path='/clienteVista' element={<ClienteVista />} />
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
            <Route path='/generarListadoMantencion' element={<GenerarListadoMantencion/>}/>
            <Route path="*" element={<Error />} />
          </Routes>
        </AuthContextProvider>
      )}
    </div>
  );
}

export default App;
