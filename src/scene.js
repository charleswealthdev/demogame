import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


export function createHeroScene(container){

const scene = new THREE.Scene()
const canvas = document.querySelector('canvas.webgl')
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias:true
})

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const loadingManager = new THREE.LoadingManager();

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
    console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files: ${url}`);
    const progress = (itemsLoaded / itemsTotal) * 100;
  
    document.getElementById('progress-bar').style.width = `${progress}%`;

      progressBar.style.width = `${progress}%`; // Update the progress bar width
    } else {
      console.warn('Progress bar element is not found.');
    }
   
};

// Handle loading errors
loadingManager.onError = (url) => {
    console.error(`There was an error loading ${url}`);
};

// Use the LoadingManager with loaders
const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
const listener = new THREE.AudioListener();

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader(loadingManager);

// scene.background = new THREE.Color(0x87ceeb); // Sky blue




const rgbeLoader = new RGBELoader();
rgbeLoader.load('/shanghai_bund_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // Apply to scene
  scene.background = new THREE.Color(0x87ceeb); // Sky blue

});

// rgbeLoader.load('/street_lamp_1k.hdr', (texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   scene.environment = texture;

//   renderer.toneMappingExposure = 0.6; // Reduce HDR brightness

//   const light = new THREE.DirectionalLight(0xffffff, 0.4);
//   light.position.set(5, 10, 5);
//   scene.add(light);
// });



camera.add(listener);

// 3. Set up the background music (using Web Audio API)

const backgroundMusic = new THREE.Audio(listener);

// Load and play the background music
audioLoader.load('Push-Long-Version(chosic.com).mp3', function (buffer) {
  backgroundMusic.setBuffer(buffer);
  backgroundMusic.setLoop(true); // Set to loop
  backgroundMusic.setVolume(0.2); // Set the volume
  backgroundMusic.play(); // Start playing the music
});



const objectSound = new THREE.PositionalAudio(listener);
audioLoader.load('breathing-fast-247449.mp3', function (buffer) {
  objectSound.setBuffer(buffer);
  objectSound.setLoop(true);
  objectSound.setVolume(0.5);
  objectSound.play();
});


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
const hemisphereLight = new THREE.HemisphereLight(0xffffff,0x444444, 0.6)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows
directionalLight.shadow.mapSize.width = 512; // Higher resolution shadows
directionalLight.shadow.mapSize.height = 512;
scene.add(directionalLight);
  scene.add(ambientLight, hemisphereLight);



  let player, mixer, actions = {};

  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); // Set the path to Draco decoder files
 
  // Attach DracoLoader to GLTFLoader
  gltfLoader.setDRACOLoader(dracoLoader);
  // Load Model
  gltfLoader.load('/myavatar.glb', (gltf) => {
    player = gltf.scene;
  
    player.scale.setScalar(1.4)
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
   
    player.add(objectSound)
    // Animation setup
    mixer = new THREE.AnimationMixer(player);
    gltf.animations.forEach((clip) => {
      actions[clip.name.toLowerCase()] = mixer.clipAction(clip);
    });
  
    if (actions['armature|mixamo.com|layer0']) {
      actions['armature|mixamo.com|layer0'].play();
    }
  });


//   gltfLoader.load('/road__highway.glb', (gltf3) => {
//     const hillModel = gltf3.scene
//     // Add the loaded model to the scene
//     hillModel.position.set(0,0,0)
//     hillModel.scale.set(10,1,10)

//     scene.add(hillModel)
// });


const textureTest = textureLoader.load('/cloudy-veined-quartz-light-unity/cloudy-veined-quartz-light_preview.jpg')
const textureNormal = textureLoader.load('/rocky-worn-ground-bl/rocky-worn-ground-normal-ogl.png')
const textureAO = textureLoader.load('rocky-worn-ground-bl/rocky-worn-ground-ao.png')
const textureM = textureLoader.load('rocky-worn-ground-bl/rocky-worn-ground1.png')
const textureR = textureLoader.load('rocky-worn-ground-bl/rocky-worn-ground_Roughness.png')
  
//   // create and add ground to the scene

const groundMaterial = new THREE.MeshStandardMaterial({
  map: textureTest,
  normalMap: textureNormal,
  roughnessMap: textureR,
  aoMap: textureM,
  side: THREE.DoubleSide,
  envMap: scene.environment,
  metalness: 1.0,
  //     roughness: 0.0, // Slight displacement for added depth
});

  const groundGeo = new THREE.PlaneGeometry(50, 50);


  
  // const ground = new THREE.Mesh(groundGeo, groundMaterial);
  // ground.rotation.x = -Math.PI / 2;
  // ground.position.y = 0;
  // ground.receiveShadow = true;
  // scene.add(ground);

  const groundTiles = [];
  const groundCount = 2;
  let speed = 0.1; 
  
  for (let i = 0; i < groundCount; i++) {
    const ground = new THREE.Mesh(groundGeo, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -i * 50; // Adjust for seamless tiling
    ground.receiveShadow = true;
    ground.castShadow=true
    scene.add(ground);
    groundTiles.push(ground);
  }


  
  function updateGround() {
    groundTiles.forEach((ground) => {
      ground.position.z += speed;
      if (ground.position.z > 50) {
        ground.position.z -= groundCount * 50;
      }
    });
  }

// Start with a slower speed

// const highwayTiles = [];
//   const highwayCount = 2; // Number of highway tiles
//   const highwayLength = 20; // Length of each highway tile

// gltfLoader.load('/road_hd.glb', (gltf3) => {
//   const highwayModel = gltf3.scene;

//   // Array to hold the highway tiles
  
//   // Initialize and position highway tiles
//   for (let i = 0; i < highwayCount; i++) {
//     const highwayTile = highwayModel.clone(); // Clone the model for each tile
//     highwayTile.position.set(0, 0, -i * highwayLength); // Position the tiles sequentially
//     highwayTile.scale.set(10, 1, 10); // Adjust scale if needed
//     highwayTile.rotation.y = Math.PI;
//     highwayTile.receiveShadow=true;
//     highwayTile.castShadow = true;

//     scene.add(highwayTile); // Add to the scene
//     highwayTiles.push(highwayTile); // Add to the array
//   }


// })


// function updateHighway() {
//   highwayTiles.forEach((tile) => {
//     tile.position.z += speed; // Move tile forward
//     if (tile.position.z > highwayLength) {
//       tile.position.z -= highwayCount * highwayLength; // Wrap around to the back
//     }
//   });
// }


// Array to hold obstacles
const obstacles = [];

// Create obstacles function
function createObstacles() {
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

          // // Randomize obstacle size
          // const size = Math.random() * 2 + 1; // Random size between 1 and 3
          model.scale.set(1.8,1.8,1.8);

          // // Randomize position
          model.position.set(
            Math.random() * 10 - 5, // Random x position
           1.6,               // y position based on size
            -20                     // Start far back on the z-axis
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
        });
        return; // Exit the function to avoid adding a non-existent obstacle below
    }

    // Randomize obstacle size
    const size = Math.random() * 2 + 1; // Random size between 1 and 3
    obstacle.scale.set(1,1,1);

    // Randomize position
    obstacle.position.set(
      Math.random() * 10 - 5, // Random x position
      1,               // y position based on size
      -20                     // Start far back on the z-axis
    );

    // Enable shadows for obstacle
    obstacle.castShadow = true;
    obstacle.receiveShadow = true;

    // Add the obstacle to the scene
    scene.add(obstacle);

    // Store the obstacle for future updates
    obstacles.push(obstacle);
  });
}

// Call `createObstacles` periodically, e.g., every 6 seconds
setInterval(createObstacles, 6000);

//   function updateObstacles(){
// obstacles.forEach((obstacle)=> {
//     checkBonusPoints(player, obstacle);
 
//   obstacle.position.z += speed;
//   if(obstacle.position.z>10){
// obstacle.position.z = -20;
// obstacle.position.x= Math.random( ) * 10 - 5;
//   }
// })

//   }

//   setInterval(createObstacles,2000)


function updateObstacles() {
  obstacles.forEach((obstacle) => {
    // Check for bonus points if the player avoids the obstacle

    // Move obstacle forward
    obstacle.position.z += speed;

    // Reset obstacle if it moves past the player
    if (obstacle.position.z > 6) {
      resetObstacle(obstacle);
    }
  });
}

// Helper function to reset obstacle

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
}, 3000);

  scene.add(camera)
  
  
  
  // function updateCamera() {
  //     if (player) {
  //       camera.position.z = player.position.z + 5;
  //       camera.position.x = player.position.x;
  //       camera.position.y = 3; // Maintain consistent height
  //       camera.lookAt(player.position);
  //     }
  // }

//   function updateCamera() {
//     if (player) {
//         camera.position.lerp(
//             new THREE.Vector3(player.position.x, 3, player.position.z + 5),
//             0.1 // Smooth factor
//         );
//         camera.lookAt(player.position.x, player.position.y, player.position.z);
//     }
// }
const cameraDistance = 7; // Adjust the distance as needed

// Set the initial camera position to be farther from the player
camera.position.set(0, 5, 10); // Keep the camera near the scene
camera.lookAt(new THREE.Vector3(0,3,0))
// Optionally, you can add some controls to move the camera slightly around the player (e.g., orbit controls)

function updateCamera() {
  if (player && player.position) {
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 8; // Ensure camera stays behind
    camera.lookAt(player.position);
  } else {
    console.warn("Player or player position is undefined.");
  }
}
  const controls = new OrbitControls(camera,canvas)
  controls.enableDamping=true;
  controls.enableZoom = true; // Enable pinch zoom
  controls.maxDistance = 25;  // Limit zoom distance
 controls.minDistance = 5;   // Avoid zooming too close


// // Mobile swipe-to-move variables
// let startX = 0;
// let startY = 0;
// let isTouching = false;

// // Device orientation variables (tilt)
// let tiltX = 0;
// let tiltY = 0;

// // Touch start event for swipe detection
// renderer.domElement.addEventListener('touchstart', (event) => {
//   if (event.touches.length === 1) {
//     // Start touch, save initial positions
//     startX = event.touches[0].pageX;
//     startY = event.touches[0].pageY;
//     isTouching = true;
//   }
// }, false);

// // Touch move event for swipe detection
// renderer.domElement.addEventListener('touchmove', (event) => {
//   if (!isTouching) return;

//   // Get touch movement
//   const diffX = event.touches[0].pageX - startX;
//   const diffY = event.touches[0].pageY - startY;

//   // Update camera position or object based on swipe (example moves camera)
//   camera.position.x -= diffX * 0.05; // Adjust speed factor as needed
//   camera.position.y += diffY * 0.05;

//   // Update start positions to calculate new movement
//   startX = event.touches[0].pageX;
//   startY = event.touches[0].pageY;
// }, false);

// // Touch end event to stop touch tracking
// renderer.domElement.addEventListener('touchend', () => {
//   isTouching = false;
// }, false);

// // Device orientation event to detect tilt (using device's gyroscope)
// window.addEventListener('deviceorientation', (event) => {
//   tiltX = event.gamma; // Left-to-right tilt in degrees
//   tiltY = event.beta;  // Forward-and-backward tilt in degrees

//   // Apply tilt to camera (for example)
//   camera.position.x += tiltX * 0.1; // Adjust sensitivity as needed
//   camera.position.y -= tiltY * 0.1; // Adjust sensitivity as needed
// }, false);

// let touchStartX = 0;
// let touchStartY = 0;
// let isTouching = false;

// window.addEventListener('touchstart', (e) => {
//   touchStartX = e.touches[0].clientX;
//   touchStartY = e.touches[0].clientY;
//   isTouching = true;
// });

// window.addEventListener('touchmove', (e) => {
//   if (isTouching) {
//     let touchMoveX = e.touches[0].clientX;
//     let touchMoveY = e.touches[0].clientY;

//     // Calculate movement delta
//     const deltaX = touchMoveX - touchStartX;
//     const deltaY = touchMoveY - touchStartY;

//     // Update player position or other actions
//     player.position.x += deltaX * 0.01; // Adjust movement speed
//     player.position.y += deltaY * 0.01;

//     touchStartX = touchMoveX;
//     touchStartY = touchMoveY;
//   }
// });

// window.addEventListener('touchend', () => {
//   isTouching = false;
// });// Create joystick and handle elements
// let joystick = document.createElement('div');
// joystick.style.position = 'absolute';
// joystick.style.bottom = '20px';
// joystick.style.left = '20px';
// joystick.style.borderRadius = '50%';
// joystick.style.background = 'rgba(0, 0, 0, 0.5)';
// joystick.style.touchAction = 'none'; // Prevents the default touch behavior (scrolling/pinch)

// // Append the joystick to the body
// document.body.appendChild(joystick);

// // Handle element inside the joystick
// let handle = document.createElement('div');
// handle.style.position = 'absolute';
// handle.style.borderRadius = '50%';
// handle.style.background = 'rgba(255, 255, 255, 0.8)';
// joystick.appendChild(handle);

// let isDragging = false;
// let startTouch = { x: 0, y: 0 };

// // Dynamically set joystick size based on screen width
// const setJoystickSize = () => {
//   const screenWidth = window.innerWidth;

//   // Set the joystick size to be 20% of the screen width, but with a minimum size of 100px and a maximum of 200px
//   const joystickSize = Math.min(Math.max(screenWidth * 0.2, 100), 200);
//   joystick.style.width = `${joystickSize}px`;
//   joystick.style.height = `${joystickSize}px`;

//   // Set the handle size to 50% of the joystick size
//   const handleSize = joystickSize / 2;
//   handle.style.width = `${handleSize}px`;
//   handle.style.height = `${handleSize}px`;

//   // Center the handle in the joystick
//   handle.style.left = `${(joystickSize - handleSize) / 2}px`;
//   handle.style.top = `${(joystickSize - handleSize) / 2}px`;
// };

// // Call the function initially to set the size
// setJoystickSize();


// Adjust joystick size on window resize
// window.addEventListener('resize', setJoystickSize);

// Joystick interaction logic
// joystick.addEventListener('touchstart', (e) => {
//   isDragging = true;
//   startTouch.x = e.touches[0].clientX;
//   startTouch.y = e.touches[0].clientY;
// });

// joystick.addEventListener('touchmove', (e) => {
//   if (isDragging) {
//     const rect = joystick.getBoundingClientRect();
//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;

//     // Calculate movement deltas
//     const deltaX = e.touches[0].clientX - centerX;
//     const deltaY = e.touches[0].clientY - centerY;

//     // Limit the joystick handle's movement within the joystick boundary
//     const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), rect.width / 2);
//     const angle = Math.atan2(deltaY, deltaX);

//     // Move the handle within the boundary
//     handle.style.left = `${centerX + Math.cos(angle) * distance - handle.offsetWidth / 2}px`;
//     handle.style.top = `${centerY + Math.sin(angle) * distance - handle.offsetHeight / 2}px`;

//     // Control the player based on the handle's position
//     const moveFactor = distance / (rect.width / 2);
//     player.position.x += Math.cos(angle) * moveFactor * 0.1;
//     player.position.z += Math.sin(angle) * moveFactor * 0.1;
//   }
// });

// joystick.addEventListener('touchend', () => {
//   isDragging = false;

//   // Reset the handle position to the center after touch ends
//   handle.style.left = `${(joystick.offsetWidth - handle.offsetWidth) / 2}px`;
//   handle.style.top = `${(joystick.offsetHeight - handle.offsetHeight) / 2}px`;
// });

// // Optional: Add touch cancel event to handle edge cases when touch is lost
// joystick.addEventListener('touchcancel', () => {
//   isDragging = false;
//   handle.style.left = `${(joystick.offsetWidth - handle.offsetWidth) / 2}px`;
//   handle.style.top = `${(joystick.offsetHeight - handle.offsetHeight) / 2}px`;
// });



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
          
          if (!player || !obstacles || !objectSound || !backgroundMusic) {
            console.error("Player, obstacles, or sound objects are undefined.");
            return;
          }
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
        const button = document.createElement('button');
        button.innerText = 'Restart Game';
        Object.assign(button.style, {
          position: 'absolute',
          top: '80%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '15px 30px',
          fontSize: '24px',
          fontWeight: 'bold',
          backgroundColor: 'lightblue',
          border: 'none',
          borderRadius: '10px',
          color: '#fff',
          cursor: 'pointer',
          zIndex: '1000',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        });
        button.onmouseover = () => (button.style.backgroundColor = '#1e90ff');
        button.onmouseout = () => (button.style.backgroundColor = 'lightblue');
      
        // Create game over overlay
        const gameOverOverlay = document.createElement("div");
        Object.assign(gameOverOverlay.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
        });
        gameOverOverlay.innerHTML = `
          <p>Game Over!</p>
          <p>Your Final Score: ${score}</p>
          <p>Press "R" to Restart or Double Tap the Button Below</p>
        `;
        gameOverOverlay.appendChild(button);
      
        // Cancel the animation loop
        cancelAnimationFrame(animationFrameId);
        document.body.appendChild(gameOverOverlay);
      
        // Restart the game when the button is clicked
        button.addEventListener('click', restartGame);
      
        // Add a keydown event listener for 'R'
        const keyListener = (event) => {
          if (event.key.toLowerCase() === "r") {
            restartGame();
          }
        };
        window.addEventListener("keydown", keyListener);
      }
      

      
      function restartGame() {
        gameOver = false;
        score = 0;
        speed = 0.08;
        player.position.set(0, 1, 0);
      
        // Play background music
        backgroundMusic.play();
      
        // Reset obstacle positions
        obstacles.forEach((obstacle, index) => {
          obstacle.position.z = -20 - index * 10;
          obstacle.passed = false;
        });
      
        // Remove the game over overlay
        const gameOverOverlay = document.querySelector("div");
        if (gameOverOverlay) {
          document.body.removeChild(gameOverOverlay);
        }
      

        setupJoystick()
        // Reset score display
        scoreElement.innerHTML = `Score: ${score}`;
      
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      
        // Restart the animation loop
        animate();
      }
      
      // Tilt Control Logic
      let isTiltControlEnabled = false;
      window.addEventListener("deviceorientation", (event) => {
        if (isTiltControlEnabled && !gameOver) {
          const tiltX = event.gamma; // Left/Right tilt
          const tiltY = event.beta; // Forward/Backward tilt
      
          // Map tilt to player movement
          player.position.x += (tiltX / 50) * 0.5; // Adjust sensitivity
          player.position.z += (tiltY / 50) * 0.5;
        }
      });
      
      // Toggle Control UI

      // Style the control toggle button for a glass look
const controlToggle = document.createElement("button");
controlToggle.innerText = "Switch to Tilt Control";
controlToggle.style.position = "absolute";
controlToggle.style.top = "10px";
controlToggle.style.right = "10px";
controlToggle.style.padding = "12px 20px";
controlToggle.style.fontSize = "16px";
controlToggle.style.fontWeight = "bold";
controlToggle.style.color = "#ffffff"; // White text for contrast
controlToggle.style.background = "rgba(255, 255, 255, 0.2)"; // Transparent white
controlToggle.style.border = "1px solid rgba(255, 255, 255, 0.3)"; // Subtle border
controlToggle.style.borderRadius = "12px";
controlToggle.style.backdropFilter = "blur(10px)"; // Glassmorphism blur effect
controlToggle.style.webkitBackdropFilter = "blur(10px)"; // For Safari support
controlToggle.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)"; // Soft shadow
controlToggle.style.transition = "all 0.3s ease";
controlToggle.style.cursor = "pointer";
controlToggle.style.zIndex = "1000";
document.body.appendChild(controlToggle);

// Hover effects
controlToggle.onmouseover = () => {
  controlToggle.style.background = "rgba(255, 255, 255, 0.3)";
  controlToggle.style.boxShadow = "0px 6px 20px rgba(0, 0, 0, 0.3)";
};
controlToggle.onmouseout = () => {
  controlToggle.style.background = "rgba(255, 255, 255, 0.2)";
  controlToggle.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
};

// Click effect
controlToggle.onmousedown = () => {
  controlToggle.style.transform = "scale(0.95)";
};
controlToggle.onmouseup = () => {
  controlToggle.style.transform = "scale(1)";
};

// Add event listener for functionality
controlToggle.addEventListener("click", () => {
  isTiltControlEnabled = !isTiltControlEnabled;
  controlToggle.innerText = isTiltControlEnabled
    ? " Joystick Control"
    : " Tilt Control";
});

      
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
        joystick.addEventListener("touchstart", () => (isDragging = true));
        joystick.addEventListener("touchmove", (e) => {
          if (isDragging) {
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
      
            const deltaX = e.touches[0].clientX - centerX;
            const deltaY = e.touches[0].clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX);
      
            player.position.x += Math.cos(angle) * 0.1;
            player.position.z += Math.sin(angle) * 0.1;
          }
        });
        joystick.addEventListener("touchend", () => (isDragging = false));
      }
      
      setupJoystick();
      


      

      
  // Create the restart button

      // function checkCollision(){
      //   obstacles.forEach((obstacle)=>{
      //     const playerBox = new THREE.Box3().setFromObject(player);
          

      //   const obstacleBox =  new THREE.Box3().setFromObject(obstacle);

      //   if(playerBox.intersectsBox(obstacleBox)){
      //     alert(`Game Over! Your score: ${score}`);
      //     localStorage.setItem('highScore', Math.max(score, localStorage.getItem('highScore') || 0));
      //     resetGame();
      //   }
      //   })
      // }

    

  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    console.log('resized')
  });

      renderer.shadowMap.enabled = true;
      const clock = new THREE.Clock()
  function animate(){
    if (gameOver) return; // Stop updates if the game is over

    animationFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if(player){
      updateCamera()
    }

    if (!gameOver) {
      updateCamera(); 
    updatePlayer()
    updateObstacles()
    increaseDifficulty()
    updateScore()
updateGround() 

    }
    checkGameOver(player, obstacles);
    controls.target.set(0, 0, 0);
    controls.update()
    
    // updateHighway()
    // ground.position.z += speed;
    // if(ground.position.z > 10 ){
    //   ground.position.z =0;
    // }

    renderer.render(scene,camera)
  }
  animate()
}