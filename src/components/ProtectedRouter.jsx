// Componente ProtectedRoute:

// Este componente React se utiliza para proteger rutas en la aplicación.
// Si un usuario no está autenticado, redirige a la página de inicio.

// Funciones y Características Principales:

// - Utiliza el contexto `UserAuth` para obtener la información del usuario.
// - Si no hay un usuario autenticado, utiliza el componente `Navigate` para redirigir al usuario a la página de inicio.
// - Si hay un usuario autenticado, renderiza el contenido de la ruta protegida (pasado como children).





import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = UserAuth();

  if (!user) {
    return <Navigate to='/' />;
  }
  return children;
};

export default ProtectedRoute;