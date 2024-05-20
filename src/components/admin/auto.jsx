import React, { useEffect } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const CarScene = () => {
  useEffect(() => {
    const container = document.getElementById('car-container');
    
    if (!container) {
      console.error('Contenedor no encontrado');
      return;
    }
    
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // El segundo parámetro es la opacidad (0 para transparente)
    container.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(
      '/models/scene.gltf', // Usa la ruta relativa a la raíz
      function (gltf) {
        console.log('Modelo cargado con éxito');
        const car = gltf.scene;
        scene.add(car);
      },
      undefined,
      function (error) {
        console.error('Error al cargar el modelo:', error);
      }
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.rotateSpeed = 0.5;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div id="car-container" style={{ width: '100%', height: '100%' }} />;
};

export default CarScene;
