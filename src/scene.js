import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


export function createHeroScene(container){




const canvas = container.querySelector('.webgl');


// Get dimensions for rendering
const width = container.clientWidth || window.innerWidth;
const height = container.clientHeight || window.innerHeight;


let currentScene = 'mainMenu';
// Scene setup
const mainMenuScene = new THREE.Scene();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020); // Dark background

// Camera setup
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 2, 5);
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance", // Prioritize performance
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio < 2 ? window.devicePixelRatio : 2);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;





const loadingManager = new THREE.LoadingManager();

// Use the LoadingManager with loaders
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
const listener = new THREE.AudioListener();
const backgroundMusic = new THREE.Audio(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader(loadingManager);

// Show loading screen while assets are loading
loadingManager.onStart = () => {
};

// When all assets are loaded
loadingManager.onLoad = () => {
    console.log('All assets loaded');
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none'; // Hide preloader

   
};


const progressBar = document.querySelector('#progress-bar');
// Track loading progress
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  if (progressBar) {
    // console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files: ${url}`);
    const progress = (itemsLoaded / itemsTotal) * 100;
  
    document.getElementById('progress-bar').style.width = `${progress}%`;

      progressBar.style.width = `${progress}%`; // Update the progress bar width
    } else {
      console.warn('Progress bar element is not found.');
    }
   
};

// Handle loading errors
loadingManager.onError = (url) => {
    // console.error(`There was an error loading ${url}`);
};


// Load and play the background music
audioLoader.load('Push-Long-Version(chosic.com).mp3', function (buffer) {
  backgroundMusic.setBuffer(buffer);
  backgroundMusic.setLoop(true); // Set to loop
  backgroundMusic.setVolume(0.2); // Set the volume
  backgroundMusic.play(); // Start playing the music
});




const rgbeLoader = new RGBELoader();
rgbeLoader.load('/shanghai_bund_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // Apply to scene
  scene.background = new THREE.Color(0x87ceeb); // Sky blue

});

camera.add(listener);

// 3. Set up the background music (using Web Audio API)






const gameOverSound = new THREE.Audio(listener);
audioLoader.load('male-scream-95807.mp3', function (buffer) {
  gameOverSound.setBuffer(buffer);
  gameOverSound.setVolume(0.5); // Set volume for game over sound
});


// 12. Add play/stop sound button// Create play/stop button
const playStopButton = document.createElement('button');
playStopButton.innerHTML = `<i class="fas fa-volume-up"></i>`; // Play icon (Font Awesome)

// Style the button with glassy, frosted effect
playStopButton.style.position = 'absolute';
playStopButton.style.top = '10px';
playStopButton.style.right = '10px';
playStopButton.style.padding = '15px';
playStopButton.style.fontSize = '30px';
playStopButton.style.cursor = 'pointer';
playStopButton.style.zIndex = '1000';
playStopButton.style.border = 'none';
playStopButton.style.background = 'rgba(255, 255, 255, 0.2)'; // Transparent white background
playStopButton.style.borderRadius = '50%'; // Circular button
playStopButton.style.backdropFilter = 'blur(10px)'; // Frosted glass effect
playStopButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'; // Subtle shadow for depth
playStopButton.style.transition = 'all 0.3s ease'; // Smooth transition for effects

// Hover effect styling
playStopButton.addEventListener('mouseover', function () {
  playStopButton.style.background = 'rgba(255, 255, 255, 0.4)'; // Slightly darker on hover
  playStopButton.style.transform = 'scale(1.1)'; // Zoom effect
});

playStopButton.addEventListener('mouseout', function () {
  playStopButton.style.background = 'rgba(255, 255, 255, 0.2)'; // Reset background on mouse out
  playStopButton.style.transform = 'scale(1)'; // Reset zoom effect
});

// Append button to body
document.body.appendChild(playStopButton);

// Toggle play/stop background music when clicked
playStopButton.addEventListener('click', function () {
  if (backgroundMusic.isPlaying) {
    backgroundMusic.pause();
    playStopButton.innerHTML = `<i class="fas fa-volume-mute"></i>`; // Switch to play icon
  } else {
    backgroundMusic.play();
    playStopButton.innerHTML = `<i class="fas fa-volume-down"></i>`; // Switch to stop icon
  }
});



// add light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// const pointLight = new THREE.PointLight(0xffffff, 1,100)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows
directionalLight.shadow.mapSize.width = 256; // Higher resolution shadows
directionalLight.shadow.mapSize.height = 256;
scene.add(directionalLight);
  scene.add(ambientLight);



  


  let player, mixer, actions = {};
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); 
  // Attach DracoLoader to GLTFLoader
  gltfLoader.setDRACOLoader(dracoLoader);


 
  let mainMenucharacter;
  // Load character model
  gltfLoader.load('avatarland.glb', (gltf) => {
      mainMenucharacter = gltf.scene;
      mainMenucharacter.scale.set(2, 2, 2); // Proper scaling
      mainMenucharacter.position.set(0, -1.9, 0); // Matches terrain height
      mainMenuScene.add(mainMenucharacter);

  });


  // Load Model
  gltfLoader.load('/myavatar.glb', (gltf) => {
    player = gltf.scene;

    player.scale.setScalar(1.05)
    // Bounding box for positioning
    const box = new THREE.Box3().setFromObject(player);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
  
    player.position.set(0, -box.min.y, 0);
    player.rotation.y = Math.PI;
    player.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  
    scene.add(player);
   
    // Animation setup
    mixer = new THREE.AnimationMixer(player);
    gltf.animations.forEach((clip) => {
      actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
    });
  
    if (actions['armature|mixamo.com|layer0']) {
      actions['armature|mixamo.com|layer0'].play();
    }
  });


  function createBuilding(width, height, depth, color) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshLambertMaterial({ color });
    const building = new THREE.Mesh(geometry, material);
    building.castShadow = true; // Enable shadow casting for realism
    building.receiveShadow = true;
    return building;
  }
  
  // Function to create a tree
  function createTree() {
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown color for trunk
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
    const foliageGeometry = new THREE.SphereGeometry(2, 16, 16);
    const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Green color for foliage
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    
    foliage.position.y = 2.5; // Position foliage above the trunk
    
    const tree = new THREE.Group();
    tree.add(trunk);
    tree.add(foliage);
    tree.castShadow = true;
    tree.receiveShadow = true;
    return tree;
  }
  
  

  // const roadLength = 200;


const textureTest = textureLoader.load('/cloudy-veined-quartz-light-unity/cloudy-veined-quartz-light_preview.jpg')
const textureNormal = textureLoader.load('/rocky-worn-ground-bl/rocky-worn-ground-normal-ogl.png')
const textureM = textureLoader.load('rocky-worn-ground-bl/rocky-worn-ground1.png')
const textureR = textureLoader.load('rocky-worn-ground-bl/rocky-worn-ground_Roughness.png')

  
// Constants
const groundWidth = 50;
const groundLength = 50;
const groundCount = 3; // Number of ground tiles
const tileSpacing = groundLength;
let speed = 0.8; // Speed of the environment

// Ground material
const groundMaterial = new THREE.MeshStandardMaterial({
  map: textureTest,
  normalMap: textureNormal,
  roughnessMap: textureR,
  aoMap: textureM,
  side: THREE.DoubleSide,
  metalness: 1.0,
});

let treeModel = null;
let buildingModel = null;
const tileGroups = [];

function loadModel(path, callback) {
  gltfLoader.load(
    path,
    (gltf) => {
      const model = gltf.scene;
      callback(model);
    },
    undefined,
    (error) => {
      console.error(`An error occurred while loading the model from ${path}:`, error);
      callback(null); // Pass null if loading fails
    }
  );
}

function loadAssets(callback) {
  let assetsLoaded = 0;

  const checkAssetsLoaded = () => {
    assetsLoaded++;
    if (assetsLoaded === 2) {
      callback(); // Proceed once both models are loaded
    }
  };

  loadModel('low_poly_trees_free.glb', (model) => {
    treeModel = model;
    checkAssetsLoaded();
  });

  loadModel('low_poly_public_buildings_pack.glb', (model) => {
    buildingModel = model;
    checkAssetsLoaded();
  });
}

function createTree(scale = 2.5) {
  if (!treeModel) {
    console.error('Tree model is not loaded yet.');
    return new THREE.Group(); // Return an empty placeholder
  }
  const treeInstance = treeModel.clone();
  treeInstance.scale.set(scale, scale, scale);
  treeInstance.castShadow = true;
  treeInstance.receiveShadow = true;
  return treeInstance;
}

function createBuilding(scale = 0.5) {
  if (!buildingModel) {
    console.error('Building model is not loaded yet.');
    return new THREE.Group(); // Return an empty placeholder
  }
  const buildingInstance = buildingModel.clone();
  buildingInstance.scale.set(scale, scale, scale);
  buildingInstance.castShadow = true;
  buildingInstance.receiveShadow = true;
  return buildingInstance;
}

function createTile(zOffset) {
  const tileGroup = new THREE.Group();

  // Ground
  const groundGeo = new THREE.PlaneGeometry(groundWidth, groundLength);
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;
  ground.receiveShadow = true;
  tileGroup.add(ground);

  // Trees
  for (let z = -groundLength / 2; z < groundLength / 2; z += 10) {
    const treeLeft = createTree();
    treeLeft.position.set(-20, 0, z);
    tileGroup.add(treeLeft);

    const treeRight = createTree();
    treeRight.position.set(20, 0, z);
    tileGroup.add(treeRight);
  }

  // Buildings
  for (let z = -groundLength / 2; z < groundLength / 2; z += 15) {
    const buildingLeft = createBuilding();
    buildingLeft.position.set(-30, 0, z);
    tileGroup.add(buildingLeft);

    const buildingRight = createBuilding();
    buildingRight.position.set(30, 0, z);
    tileGroup.add(buildingRight);
  }

  tileGroup.position.z = zOffset;
  return tileGroup;
}

function initializeScene() {
  loadAssets(() => {
    for (let i = 0; i < groundCount; i++) {
      const zOffset = -i * tileSpacing;
      const tile = createTile(zOffset);
      scene.add(tile);
      tileGroups.push(tile);
    }
  });
}

// Update tiles for infinite scrolling
function updateGround(tileGroups) {
  tileGroups.forEach((tile) => {
    tile.position.z += speed;

    // If the tile moves out of view, reposition it to the back
    if (tile.position.z > tileSpacing) {
      tile.position.z -= groundCount * tileSpacing;
    }
  });
}

// Call initialization function
initializeScene();


// Array to hold obstacles
const obstacles = [];

// Maximum number of active obstacles
const maxObstacles = 5; // Reduced for easier gameplay

// Minimum distance between obstacles on the z-axis
const minZDistance = 20; // Increase distance for easier navigation

// Create obstacles function
function createObstacles() {
  if (obstacles.length >= maxObstacles) {
    return; // Prevent adding more obstacles if max limit is reached
  }

  const textureLoader = new THREE.TextureLoader();

  // Randomly choose between different obstacle types (geometries or models)
  const obstacleType = Math.floor(Math.random() * 4); // Now selecting from 0 to 3

  textureLoader.load('/cx3.jpg', (texture) => {
    let obstacle;

    // Material for all geometries
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      roughness: 1,
      metalness: 0.5,
    });

    switch (obstacleType) {
      case 0: // Cube
        obstacle = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        break;

      case 1: // Sphere
        obstacle = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
        break;

      case 2: // Cone
        obstacle = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
        break;

      case 3: // Custom 3D Model (GLTF)
        const models = [
          '/green-goblin_bomb.glb',
          '/cherri_bomb.glb',
          '/bomb.glb',
        ];
        const selectedModel = models[Math.floor(Math.random() * models.length)];

      

        gltfLoader.load(selectedModel, (gltf) => {
          const model = gltf.scene;

          model.scale.set(1, 1, 1);

          // Randomize position
          model.position.set(
            Math.random() * 10 - 5, // Random x position
            1.4,
            obstacles.length > 0
              ? obstacles[obstacles.length - 1].position.z - minZDistance
              : -20
          );

          // Enable shadows for model
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Add to scene and obstacles array
          scene.add(model);
          obstacles.push(model);

          // Manage obstacle count
          manageObstacleCount();
        });
        return; // Exit the function to avoid adding a non-existent obstacle below
    }

    // Randomize obstacle size
    obstacle.scale.set(0.5, 0.5, 0.5);

    // Randomize position
    obstacle.position.set(
      Math.random() * 10 - 5, // Random x position
      1, // y position based on size
      obstacles.length > 0
        ? obstacles[obstacles.length - 1].position.z - minZDistance
        : -20 // Start far back on the z-axis
    );

    // Enable shadows for obstacle
    obstacle.castShadow = true;
    obstacle.receiveShadow = true;

    // Add the obstacle to the scene
    scene.add(obstacle);

    // Store the obstacle for future updates
    obstacles.push(obstacle);

    // Manage obstacle count
    manageObstacleCount();
  });
}

// Function to remove the oldest obstacles if the limit is exceeded
function manageObstacleCount() {
  while (obstacles.length > maxObstacles) {
    const oldestObstacle = obstacles.shift(); // Remove the oldest obstacle from the array

    // Remove the obstacle from the scene
    scene.remove(oldestObstacle);

    // Dispose of geometry and materials to free memory
    if (oldestObstacle.geometry) oldestObstacle.geometry.dispose();
    if (oldestObstacle.material) oldestObstacle.material.dispose();
  }
}

// Call `createObstacles` periodically, e.g., every 8 seconds
setInterval(createObstacles, 8000); // Create obstacles every 8 seconds

function updateObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.position.z += speed;
    if (obstacle.position.z > 6) {
      resetObstacle(obstacle);
    }
  });
}
  function resetObstacle(obstacle) {
    obstacle.position.z = -20; // Reset to starting position
    obstacle.position.x = Math.random() * 20 - 5; // Increase range for more space
    obstacle.passed = false;
}

// Ensure the number of obstacles doesn't grow too large
setInterval(() => {
  if (obstacles.length <  5) { // Limit to a reasonable number of obstacles
    createObstacles();
  }
}, 6000);

  scene.add(camera)
  






const cameraOffset = new THREE.Vector3(0,   4, 6); // Adjust based on game design
const lookAheadDistance = 10; // Distance ahead of the player to focus on

let lastPlayerPosition = new THREE.Vector3(); // Cache last position

function updateCamera() {
  // Check if player position has changed significantly
  const movementThreshold = 0.1; // Only update camera if player moves significantly
  if (player.position.distanceTo(lastPlayerPosition) > movementThreshold) {
    // Calculate the target camera position
    const targetCameraPosition = player.position.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPosition, 0.3);
    
    // Calculate the look-at position (ahead of the player)
    const lookAtPosition = player.position.clone();
    lookAtPosition.z += lookAheadDistance;

    // Update camera lookAt
    camera.lookAt(lookAtPosition);

    // Update last player position
    lastPlayerPosition.copy(player.position);
  }
}


  const controls = new OrbitControls(camera,canvas)
  controls.enableZoom = false;  // Disable zooming
controls.enablePan = false; // Disable panning (prevents movement of the camera in all directions)

  controls.maxPolarAngle = Math.PI / 2; // Restrict looking below ground
controls.minPolarAngle = Math.PI / 4;

// Prevent the camera from flipping around
controls.enableDamping = true; // Smooth out movements
controls.dampingFactor = 0.25; // Adjust damping factor for a smoother transition


// Disable rotation entirely
controls.enableRotate = false; // Disable rotation (prevents the user from rotating the camera)

// // Set a fixed distance between the camera and target
// controls.maxDistance = 10; // Set maximum distance of the camera from the target
// controls.minDistance = 10; // Set minimum distance of the camera from the target (fixed distance)

controls.update(); // Update controls to apply the changes

  let moveLeft = false
  let moveRight = false


  window.addEventListener('keydown', (event) =>{
if(event.key ==='ArrowLeft')
  moveLeft=true;
if(event.key ==='ArrowRight')
  moveRight=true;
  });
  
  window.addEventListener('keyup', (event) =>{
    if(event.key ==='ArrowLeft')
    
      moveLeft=false;
    
    if(event.key ==='ArrowRight')
      moveRight=false;
      })


      let gameOver = false; // Game over flag
      let animationFrameId
      let score=0
      
      // HTML element to display the score
      const scoreElement = document.createElement("div");
      scoreElement.style.position = "fixed";
      scoreElement.style.top = "20px";
      scoreElement.style.left = "20px";
      scoreElement.style.color = "#fff";
      scoreElement.style.fontSize = "2rem";
      scoreElement.innerHTML = `Score: ${score}`;
      document.body.appendChild(scoreElement);
      
      // Update the score periodically
      function updateScore() {
        if (!gameOver) {
          score += 1 ;
          scoreElement.innerHTML = `Score: ${score}`;
        }
      }
      
      // Award bonus points with visual feedback
     
      
      // Increase game difficulty over time
      function increaseDifficulty() {
        if (!gameOver) {
          speed += 0.000001;
        }
      }
      setInterval(increaseDifficulty, 100000);
      
      // Update player movement
      function updatePlayer() {
        if (moveLeft && player.position.x > -5) {
          player.position.x -= 0.2;
        }
        if (moveRight && player.position.x < 5) {
          player.position.x += 0.2;
        }
      }
      
      // Check if the player collides with any obstacles
      function checkGameOver(player, obstacles) {
        obstacles.forEach((obstacle) => {
          
          const playerBox = new THREE.Box3().setFromObject(player);
          const obstacleBox = new THREE.Box3().setFromObject(obstacle);
      
          if (playerBox.intersectsBox(obstacleBox)) {
            triggerGameOver();
            backgroundMusic.stop()
          }
        });
      }
      
      function triggerGameOver() {
        gameOver = true;
      
        // Pause the background music
        backgroundMusic.pause();
      
        // Play the game over sound
        gameOverSound.play();
      
      // Create and style the restart button
const restartButton = document.createElement('button');
restartButton.innerText = 'Restart Game';
Object.assign(restartButton.style, {
  backgroundColor: 'rgba(52, 152, 219, 0.3)', // Similar to feedback button styling
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '12px',
  fontSize: '18px',
  cursor: 'pointer',
  margin: '10px', // Add spacing between buttons
});
restartButton.onmouseover = () => (restartButton.style.backgroundColor = '#0d8ce0');
restartButton.onmouseout = () => (restartButton.style.backgroundColor = '#1da1f2');

// Restart game functionality
restartButton.onclick = () => {
  document.body.removeChild(gameOverOverlay); // Remove the overlay
  restartGame(); // Function to reset and restart the game
};

// Create and style the feedback button
const feedbackButton = document.createElement('button');
feedbackButton.innerText = 'Fill Feedback Form';
Object.assign(feedbackButton.style, {
  backgroundColor: 'rgba(52, 152, 219, 0.3)',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '12px',
  fontSize: '18px',
  cursor: 'pointer',
  margin: '10px', // Add spacing between buttons
});
feedbackButton.onmouseover = () => (feedbackButton.style.backgroundColor = '#0d8ce0');
feedbackButton.onmouseout = () => (feedbackButton.style.backgroundColor = '#1da1f2');

// Feedback button functionality
feedbackButton.onclick = () => {
  window.open('https://forms.gle/pUBisaZ692W3rs5XA', '_blank'); // Open feedback form
};

// Create game over overlay
const gameOverOverlay = document.createElement('div');
gameOverOverlay.id = 'gameOverOverlay'; // Add a unique ID
Object.assign(gameOverOverlay.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.5rem',
  zIndex: '1000',
});
gameOverOverlay.innerHTML = `
  <p>Game Over!</p>
  <p>Your Final Score: ${score}</p>
  <p>Press "R" to Restart or Use the Button Below</p>
`;

// Append buttons to the overlay
gameOverOverlay.appendChild(restartButton);
gameOverOverlay.appendChild(feedbackButton);
        // Cancel the animation loop
        cancelAnimationFrame(animationFrameId);
        document.body.appendChild(gameOverOverlay);
      
        // Restart the game when the button is clicked
        restartButton.addEventListener('click', restartGame);
      
        // Add a keydown event listener for 'R'
        const keyListener = (event) => {
          if (event.key.toLowerCase() === "r") {
            restartGame();
          }
        };
        window.addEventListener("keydown", keyListener);
      
        // Remove the event listener when the game restarts to avoid stacking
        restartGame.cleanupKeyListener = () => {
          window.removeEventListener("keydown", keyListener);
        };
      }
      
      function restartGame() {
        // Clean up the key listener
        if (restartGame.cleanupKeyListener) {
          restartGame.cleanupKeyListener();
        }
      
        gameOver = false;
        score = 0;
        player.position.set(0, 1, 0);
      
        // Play background music
        backgroundMusic.play();
      
        // Reset obstacle positions
        obstacles.forEach((obstacle, index) => {
          obstacle.position.z = -20 - index * 10;
          obstacle.passed = false;
        });
      
        // Remove the game over overlay
        const gameOverOverlay = document.getElementById("gameOverOverlay");
        if (gameOverOverlay) {
          document.body.removeChild(gameOverOverlay);
        }
      
        // Reset joystick setup if applicable
        setupJoystick();
      
        // Reset score display
        scoreElement.innerHTML = `Score: ${score}`;
      
        // Ensure no previous animation loops are running
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      
        // Restart the animation loop
        animate();
      }
      
      
      // Joystick Setup
      function setupJoystick() {
        const joystick = document.createElement("div");
        Object.assign(joystick.style, {
          position: "absolute",
          bottom: "5%",
          left: "5%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.5)",
        });
        document.body.appendChild(joystick);
      
        const handle = document.createElement("div");
        Object.assign(handle.style, {
          position: "absolute",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.8)",
          left: "30px",
          top: "30px",
        });
        joystick.appendChild(handle);

let isDragging = false;
let initialTouch = null;

const movementSpeed = 0.2; // Speed of horizontal movement
const deadZone = 5; // Minimum distance to register movement

// Calculate camera bounds (adjust as needed)


joystick.addEventListener("touchstart", (e) => {
  isDragging = true;
  initialTouch = e.touches[0];
});

joystick.addEventListener("touchmove", (e) => {
  if (isDragging && initialTouch) {
    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    // Calculate horizontal movement (X-axis only)
    const deltaX = e.touches[0].clientX - centerX;

    // Dead zone: Ignore minor movements near the center
    if (Math.abs(deltaX) > deadZone) {
      const normalizedX = Math.min(Math.max(deltaX / (rect.width / 2), -1), 1); // Normalize between -1 and 1

      // Move player only along the X-axis
      const { left, right } = calculateCameraBounds();
      player.position.x = Math.min(Math.max(player.position.x + normalizedX * movementSpeed, left), right);

      // Update joystick visual position (left-right only)
      joystick.style.transform = `translateX(${deltaX}px)`;
    }
  }
});

joystick.addEventListener("touchend", () => {
  isDragging = false;
  initialTouch = null;

  // Reset joystick visual position
  joystick.style.transform = "translate(0, 0)";
});

// Calculate camera bounds (adjust as needed)
function calculateCameraBounds() {
  const aspect = window.innerWidth / window.innerHeight;
  const distance = camera.position.z - player.position.z; // Distance from camera to player
  const verticalFOV = THREE.MathUtils.degToRad(camera.fov); // Correct method for converting degrees to radians
  const halfHeight = Math.tan(verticalFOV / 2) * distance;
  const halfWidth = halfHeight * aspect;

  return {
    left: -halfWidth,
    right: halfWidth,
  };
}     }

      function updatePlayerPosition() {
        player.position.y = 1; // Ground level (adjust based on your scene)
        player.position.z = 0; // Ensure no forward/backward movement
      }
  
      setupJoystick();
      
  
  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    console.log('resized')
  });

      
      const clock = new THREE.Clock()
  function animate(){
    
    if (gameOver) return; // Stop updates if the game is over
    animationFrameId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    if(player){
      updateCamera()
      updatePlayerPosition();
    }

    if (!gameOver) {
      updatePlayer();
      updateObstacles();
      increaseDifficulty();
      updateScore();
      updateGround(tileGroups);
     
  }
    checkGameOver(player, obstacles);
    controls.target.set(0, 0, 0);
    controls.update()
    renderer.render(scene,camera)
  }
  animate()
}