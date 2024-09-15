import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRouter";

// Componets (vistas)
import Login from "./components/login";
import RecuperarContrasena from "./components/RecuperarContrasena";
import LoadingScreen from "./components/loadingScreen";

// Admin
import Admin from "./components/admin/admin";
import IndexAdmin from "./components/admin/indexAdmin";
import AgregarUsuario from "./components/admin/agregarUsuario";
import ListarUsuario from "./components/admin/listadoUsuario/listarUsuario";
import AgregarFactura from "./components/admin/agregarFactura";
import AgregarInventario from "./components/admin/agregarInventario";
import ListarInventario from "./components/admin/listadoInventario/listarInventario";
import GenerarFactura from "./components/admin/factura/generarFactura";
import GestionMantencionesAdmin from "./components/admin/gestionMantencionAdmin";
import ClienteVista from "./components/admin/factura/clienteVista";
import ListadoMisFacturas from "./components/admin/listadoVentas/listadoMisFacturas";
import ListadoFacturas from "./components/admin/listadoFacturas/listadoFacturas";
import CrearClienteFactura from "./components/admin/factura/crearCliente";
import GenerarQRADmin from "./components/admin/generarCodigoQR";
import HistorialMantencionAdmin from "./components/admin/historialMantencion";
import ListarCliente from "./components/admin/listaCliente/listarCliente";
import CrearCliente from "./components/admin/agregarCliente";
import HistorialBoletasYFacturas from "./components/admin/historial/historialBoletaFactura";
import AgregarAutomovilAdmin from "./components/admin/agregarAutomnovil";
import ListadoAutomovil from "./components/admin/listadoAutomovil/listadoAutomovil";
import VistaIA from "./components/admin/IA/inteligenciaArtificial";

// Mecanico
import Mecanico from "./components/mecanico/mecanico";
import IndexMecanico from "./components/mecanico/indexMecanico";
import GestionMantenciones from "./components/mecanico/gestionMantenciones";
import ListarInventarioMecanico from "./components/mecanico/listarInventarioMecanico";
import GenerarQR from "./components/mecanico/GenerarQR";
import GenerarListadoMantencion from "./components/mecanico/generarListadoMantencion";
import AgregarMantencion from "./components/mecanico/agregarMantencion";
import AgregarAutomovil from "./components/mecanico/agregarAutomovil";

//Vendedor
import Vendedor from "./components/vendedor/vendedor";
import IndexVendedor from "./components/vendedor/indexVendedor";
import GenerarFacturaVendedor from "./components/vendedor/factura/generarFactura";
import HistorialBoletasYFacturasVendedor from "./components/vendedor/Historial/historialBoletasFacturaVendedor";

// Error
import Error from "./components/404";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
              path="/recuperarContrasena"
              element={<RecuperarContrasena />}
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/indexAdmin" element={<IndexAdmin />} />
            <Route path="/agregarUsuario" element={<AgregarUsuario />} />
            <Route path="/listarUsuario" element={<ListarUsuario />} />
            <Route path="/agregarFactura" element={<AgregarFactura />} />
            <Route path="/listadoFacturas" element={<ListadoFacturas />} />
            <Route path="/agregarInventario" element={<AgregarInventario />} />
            <Route path="/listarInventario" element={<ListarInventario />} />
            <Route path="/generarFactura" element={<GenerarFactura />} />
            <Route path="/generarqrAdmin" element={<GenerarQRADmin />} />
            <Route path="/tensorflow" element={<VistaIA />} />

            <Route
              path="/agregarAutomovilAdmin"
              element={<AgregarAutomovilAdmin />}
            />
            <Route path="/listadoAutomovil" element={<ListadoAutomovil />} />
            <Route
              path="/historialBoleta&Factura"
              element={<HistorialBoletasYFacturas />}
            />
            <Route
              path="/historialmantencion"
              element={<HistorialMantencionAdmin />}
            />
            <Route
              path="/gestionMantencionesAdmin"
              element={<GestionMantencionesAdmin />}
            />
            <Route path="/clienteVista" element={<ClienteVista />} />
            <Route
              path="/listadoMisFacturas"
              element={<ListadoMisFacturas />}
            />
            <Route
              path="/crearClienteFactura"
              element={<CrearClienteFactura />}
            />
            <Route path="/listarCliente" element={<ListarCliente />} />
            <Route path="/agregarCliente" element={<CrearCliente />} />
            <Route
              path="/mecanico"
              element={
                <ProtectedRoute>
                  <Mecanico />
                </ProtectedRoute>
              }
            />
            <Route path="/indexMecanico" element={<IndexMecanico />} />
            <Route
              path="/gestionMantenciones"
              element={<GestionMantenciones />}
            />
            <Route
              path="/listarInventarioMecanico"
              element={<ListarInventarioMecanico />}
            />
            <Route path="/generarQR" element={<GenerarQR />} />
            <Route
              path="/generarListadoMantencion"
              element={<GenerarListadoMantencion />}
            />
            <Route path="/agregarMantencion" element={<AgregarMantencion />} />
            <Route path="/agregarAutomovil" element={<AgregarAutomovil />} />
            <Route path="*" element={<Error />} />
            <Route
              path="/vendedor"
              element={
                <ProtectedRoute>
                  <Vendedor />
                </ProtectedRoute>
              }
            />
            <Route path="/indexVendedor" element={<IndexVendedor />} />
            <Route
              path="/generarFacturaVendedor"
              element={<GenerarFacturaVendedor />}
            />
            <Route
              path="/historialBoleta&FacturaVendedor"
              element={<HistorialBoletasYFacturasVendedor />}
            />
          </Routes>
        </AuthContextProvider>
      )}
    </div>
  );
}

export default App;
