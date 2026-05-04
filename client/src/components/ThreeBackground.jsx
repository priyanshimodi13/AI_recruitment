import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create floating "blob" particles
    const particleGeometry = new THREE.SphereGeometry(6, 32, 32);
    const particleCount = 15;
    
    // Color palette matching website - Lime Green Brand Accent
    const colors = [
      { color: 0xc8f135, emissive: 0xc8f135 }, // Bright Lime Green
      { color: 0x94bc00, emissive: 0x94bc00 }, // Darker Lime
    ];

    for (let i = 0; i < particleCount; i++) {
      const colorSet = colors[Math.floor(Math.random() * colors.length)];
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorSet.color),
        emissive: new THREE.Color(colorSet.emissive),
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: Math.random() * 0.3 + 0.1,
      });

      const particle = new THREE.Mesh(particleGeometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );

      particle.scale.set(
        Math.random() * 2 + 1,
        Math.random() * 1.5 + 0.5,
        Math.random() * 1.5 + 0.5
      );

      scene.add(particle);
      particlesRef.current.push({
        mesh: particle,
        velocity: {
          x: (Math.random() - 0.5) * 0.35,
          y: (Math.random() - 0.5) * 0.35,
          z: (Math.random() - 0.5) * 0.35,
        },
        rotation: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005,
        },
      });
    }

    // Add premium gradient lighting with brand lime-green colors
    const light1 = new THREE.PointLight(0xc8f135, 350, 500); 
    light1.position.set(100, 100, 100);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xd4ff47, 220, 380); // Lighter Lime
    light2.position.set(-150, -120, 80);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xa8d100, 200, 350); // Darker Lime accent
    light3.position.set(0, 150, -100);
    scene.add(light3);

    const ambientLight = new THREE.AmbientLight(0x0d0d0d, 0.7); // Match website dark text
    scene.add(ambientLight);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update camera rotation slightly based on mouse
      camera.position.x = mouseX * 20;
      camera.position.y = mouseY * 20;
      camera.lookAt(scene.position);

      // Update particles
      particlesRef.current.forEach((particle) => {
        particle.mesh.position.x += particle.velocity.x;
        particle.mesh.position.y += particle.velocity.y;
        particle.mesh.position.z += particle.velocity.z;

        particle.mesh.rotation.x += particle.rotation.x;
        particle.mesh.rotation.y += particle.rotation.y;
        particle.mesh.rotation.z += particle.rotation.z;

        // Wrap around for continuous effect
        if (Math.abs(particle.mesh.position.x) > 150) {
          particle.mesh.position.x *= -0.95;
        }
        if (Math.abs(particle.mesh.position.y) > 150) {
          particle.mesh.position.y *= -0.95;
        }
        if (Math.abs(particle.mesh.position.z) > 100) {
          particle.mesh.position.z *= -0.95;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
      particleGeometry.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
