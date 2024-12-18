# FixWay
## Gestión Taller Mecánico con Tauri, Vite y Firebase

Esta es una herramienta de gestión para un taller mecánico que permite llevar el control de los servicios, clientes, repuestos y más, usando **Tauri** para la aplicación de escritorio, **Vite** para la construcción del frontend, y **Firebase** como base de datos y autenticación en tiempo real.

## Características

- **Gestión de clientes:** Agregar, editar y eliminar clientes.
- **Gestión de usuarios:** Agregar, editar y eliminar usararios.
- **Gestión por medio de roles:** Mecanico, Administrador y Cliente.
- **Gestión de vehículos:** Control de vehículos asociados a los clientes.
- **Registro de servicios:** Agregar y visualizar servicios realizados en los vehículos.
- **Autenticación de usuarios:** Registro y login mediante Firebase.
- **Predicciones por medio de IA:** Uso de Tenserflow para la prediccion de los datos.
- **Sincronización en tiempo real:** Uso de Firebase para mantener los datos actualizados en todos los dispositivos conectados.

## Tecnologías

- **Tauri**: Framework para crear aplicaciones de escritorio ligeras con tecnologías web.
- **Vite**: Herramienta de desarrollo para frontend, proporcionando una experiencia rápida y moderna.
- **Firebase**: Plataforma para desarrollar aplicaciones móviles y web que incluye bases de datos en tiempo real, autenticación y más.

## Requisitos

- **Node.js** (versión 18 o superior)  
  Puedes instalarlo desde [aquí](https://nodejs.org/).
  
- **Rust**  
  Necesario para compilar la parte nativa de Tauri. Puedes instalarlo desde [aquí](https://www.rust-lang.org/).

- **Firebase**  
  Se requiere una cuenta en [Firebase](https://firebase.google.com/), para usar la base de datos y la autenticación.

1. **Instalar dependencias:**

   ```bash
   npm install
   ```

2. **Ejecutar el entorno de desarrollo Web:**

   ```bash
   npm run dev
   ```
3. **Ejecutar el entorno de desarrollo con Tauri:**

   ```bash
   npm run tauri dev
   ```
