import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function initializeLandingPageScene() {
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);

    // Renderer setup
    const canvas = document.querySelector('.webgl'); // Select the canvas element
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    // Add HDR environment
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('street_lamp_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
      
    });
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); 
  // Attach DracoLoader to GLTFLoader
  gltfLoader.setDRACOLoader(dracoLoader);

    // Add ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    
   gltfLoader.load('botanical_garden.glb', (gltf) => {
    const ground = gltf.scene;
    ground.position.set(0, -2, 0); // Adjust for proper grounding
    ground.scale.set(10, 10, 10);
    scene.add(ground);
});






let character;
// Load character model
gltfLoader.load('myavatar.glb', (gltf) => {
    character = gltf.scene;
    character.scale.set(2, 2, 2); // Proper scaling
    character.position.set(0, -1.9, 0); // Matches terrain height
    scene.add(character);
});

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2; // Restrict looking below ground
controls.minPolarAngle = Math.PI / 4; // Optional: Limits upward look
controls.enableZoom = false;  // Disable zooming

    function animate() {
        requestAnimationFrame(animate);

        // Rotate character for dynamic effect
        if (character) {
            character.rotation.y += 0.01;
        }

        controls.update(); // Update controls
        renderer.render(scene, camera);
    }

    animate();

    // Resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize the scene when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    initializeLandingPageScene();

    // Handle the start game button click
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
           window.location.href = '/game.html'
        });
    }
});