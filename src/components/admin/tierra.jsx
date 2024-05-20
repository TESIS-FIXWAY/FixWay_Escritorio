import React, { useEffect } from "react";
import * as THREE from 'three';
import Tierra from "../styles/indexImages/sol.jpg";

const EarthScene = () => {
  useEffect(() => {
    // Selecciona el contenedor donde se renderizará la escena
    const container = document.getElementById('earth-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Crea una escena
    const scene = new THREE.Scene();

    // Crea una cámara
    const camera = new THREE.PerspectiveCamera(85, width / height, 0.1, 10);
    camera.position.z = 10;

    // Crea un renderizador con fondo transparente
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // El segundo parámetro es la opacidad (0 para transparente)
    container.appendChild(renderer.domElement);

    // Crea una geometría esférica con ancho y alto especificados
    const geometry = new THREE.SphereGeometry(5, 32, 32);

    // Crea un material con una textura
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(Tierra);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // Crea una malla con la geometría y el material
    const earthMesh = new THREE.Mesh(geometry, material);

    // Agrega la malla a la escena
    scene.add(earthMesh);

    function animate() {
      requestAnimationFrame(animate);

      // Rota el planeta Tierra en el eje y
      earthMesh.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();

    // Manejar eventos de redimensionamiento
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Limpiar al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div id="earth-container" style={{ width: '550px', height: '350px' }} />;
};

export default EarthScene;
