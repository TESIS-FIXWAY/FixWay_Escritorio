import React, { useEffect } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Tierra from "../styles/indexImages/tierra.png";


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
    container.appendChild(renderer.domElement);

    // Crea una geometría esférica con ancho y alto especificados
    const geometry = new THREE.SphereGeometry(5, 32, 32);

    // Crea un material con una textura
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(Tierra);
    const material = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true, 
      side: THREE.DoubleSide // Renderiza ambos lados de la esfera
    });

    // Crea una malla con la geometría y el material
    const earthMesh = new THREE.Mesh(geometry, material);

    // Agrega la malla a la escena
    scene.add(earthMesh);

    // Añadir controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Añade suavidad a la interacción
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Opcional: desactiva el zoom
    controls.rotateSpeed = 0.5; // Ajusta la velocidad de rotación

    let isDragging = false;

    // Escuchar eventos de control para detener y reanudar la rotación
    controls.addEventListener('start', () => {
      isDragging = true;
    });

    controls.addEventListener('end', () => {
      isDragging = false;
    });

    function animate() {
      requestAnimationFrame(animate);

      // Rota el planeta Tierra en el eje y si no está siendo arrastrado
      if (!isDragging) {
        earthMesh.rotation.y += 0.01;
      }

      controls.update(); // Actualiza los controles
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
