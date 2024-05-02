import React, { useEffect } from "react";
import * as THREE from 'three';
import Tierra from "../styles/indexImages/tierra.png";

const EarthScene = () => {
  useEffect(() => {
    // Crea una escena
    const scene = new THREE.Scene();

    // Crea una cámara
    const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.z = 10;

    // Crea un renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

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
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Limpiar al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.remove();
    };
  }, []);

  return null;
};

export default EarthScene;
