// Componente Error:
// Este componente React se utiliza para manejar páginas no encontradas (error 404).
// Después de un breve retraso (3000 milisegundos), redirige automáticamente al usuario a la página de administrador.
// Funciones y Características Principales:
// - Utiliza el hook `useNavigate` de React Router DOM para la navegación programática.
// - Después de un retraso de 3000 milisegundos (3 segundos), redirige al usuario a la página de administrador ("/admin").
// - Muestra un mensaje de error indicando "404" y "Página no encontrada".

import { useNavigate } from "react-router-dom";

export default function Error() {

  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/admin");
  }
    , 3000);
    return (
      <div>
        <h1>404</h1>
        <h2>Pagina no encontrada</h2>
      </div>
    );
  }