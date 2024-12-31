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

// Track loading progress
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
 
    console.log(`Loaded ${itemsLoaded} of ${itemsTotal} files: ${url}`);
    const progress = (itemsLoaded / itemsTotal) * 100;
  
    document.getElementById('progress-bar').style.width = `${progress}%`;
   
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




const rgbeLoader = new RGBELoader();
rgbeLoader.load('/shanghai_bund_2k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture; // Apply to scene
scene.environment= texture
});

// loaders

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

  // Load Model
  gltfLoader.load('/myavatar.glb', (gltf) => {
    player = gltf.scene;
  
    player.scale.setScalar(1.7)
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


  
//   // create and add ground to the scene

//   const groundGeo = new THREE.PlaneGeometry(50, 50);
//    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
//   // const ground = new THREE.Mesh(groundGeo, groundMaterial);
//   // ground.rotation.x = -Math.PI / 2;
//   // ground.position.y = 0;
//   // ground.receiveShadow = true;
//   // scene.add(ground);

//   const groundTiles = [];
//   const groundCount = 2;
  
//   for (let i = 0; i < groundCount; i++) {
//     const ground = new THREE.Mesh(groundGeo, groundMaterial);
//     ground.rotation.x = -Math.PI / 2;
//     ground.position.z = -i * 50; // Adjust for seamless tiling
//     ground.receiveShadow = true;
//     scene.add(ground);
//     groundTiles.push(ground);
//   }


  
//   function updateGround() {
//     groundTiles.forEach((ground) => {
//       ground.position.z += speed;
//       if (ground.position.z > 50) {
//         ground.position.z -= groundCount * 50;
//       }
//     });
//   }

let speed = 0.08; // Start with a slower speed

const highwayTiles = [];
  const highwayCount = 2; // Number of highway tiles
  const highwayLength = 50; // Length of each highway tile

gltfLoader.load('/road_hd.glb', (gltf3) => {
  const highwayModel = gltf3.scene;

  // Array to hold the highway tiles
  
  // Initialize and position highway tiles
  for (let i = 0; i < highwayCount; i++) {
    const highwayTile = highwayModel.clone(); // Clone the model for each tile
    highwayTile.position.set(0, 0, -i * highwayLength); // Position the tiles sequentially
    highwayTile.scale.set(10, 1, 10); // Adjust scale if needed
    highwayTile.rotation.y = Math.PI;
    highwayTile.receiveShadow=true;
    highwayTile.castShadow = true;

    scene.add(highwayTile); // Add to the scene
    highwayTiles.push(highwayTile); // Add to the array
  }


})


function updateHighway() {
  highwayTiles.forEach((tile) => {
    tile.position.z += speed; // Move tile forward
    if (tile.position.z > highwayLength) {
      tile.position.z -= highwayCount * highwayLength; // Wrap around to the back
    }
  });
}



  const obstacles = [];

  
  function createObstacles() {
    // Load the obstacle model
    // gltfLoader.load('/GLB format/wall.glb', (gltf) => {
    //   const obstacle = gltf.scene;
    const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/cx3.jpg', (texture) => {
        const sphereGeometry = new THREE.BoxGeometry(1, 1, 1, 5,5,5); // Higher resolution for smoother appearance
        const sphereMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            roughness: 1,
            metalness: 0.5,
        });
      
        // Create the sphere
       const obstacle = new THREE.Mesh(sphereGeometry, sphereMaterial);
      // Randomize obstacle size
      const size = Math.random() * 2 + 1; // Random size between 1 and 3
      obstacle.scale.setScalar(1.3);
  
      // Compute the bounding box to align the obstacle properly
      const box = new THREE.Box3().setFromObject(obstacle);
      const objectSize = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(objectSize);
      box.getCenter(center);
  
      obstacle.position.set(0, -box.min.y, 0);
  
      // Enable shadows for obstacle meshes
      obstacle.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
  
      // Position the obstacle randomly
      obstacle.position.set(
        Math.random() * 10 - 5, // Random x position
        size / 2,              // y position based on size
        -20                    // Start far back on the z-axis
      );
  
      // Add the obstacle to the scene
      scene.add(obstacle);
  
      // Store the obstacle for future updates
      obstacles.push(obstacle);
    });
  }
  
  // Call `createObstacles` as needed, e.g., in an interval
  setInterval(createObstacles, 2000); // Creates a new obstacle every 2 seconds
  

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
    if (obstacle.position.z > 10) {
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
  if (obstacles.length <  10) { // Limit to a reasonable number of obstacles
    createObstacles();
  }
}, 3000);

  // camera.position.z = 10;
  // if (player) {
  //   camera.position.lerp(new THREE.Vector3(player.position.x, 3, player.position.z + 10), 0.1);
  // }
  

  // //  camera.lookAt(new THREE.Vector3(0,3,0))
  //   scene.add(camera)

  // camera.up.set(0, 1, 0); // Set the camera's "up" vector to always point upwards in world space
  // const planeHeight = 0; // y position of the ground plane
  // camera.position.y = Math.max(camera.position.y, planeHeight + 1); // Keep camera above the ground
  
  camera.position.set(0,3,10)
  camera.lookAt(0,1,0)
  // camecamera.lookAt(0,0,0)ra.lookAt(cube.position)
  scene.add(camera)
  
  
  
  // function updateCamera() {
  //     if (player) {
  //       camera.position.z = player.position.z + 5;
  //       camera.position.x = player.position.x;
  //       camera.position.y = 3; // Maintain consistent height
  //       camera.lookAt(player.position);
  //     }
  // }

  function updateCamera() {
    if (player) {
        camera.position.lerp(
            new THREE.Vector3(player.position.x, 3, player.position.z + 5),
            0.1 // Smooth factor
        );
        camera.lookAt(player.position.x, player.position.y, player.position.z);
    }
}


  const controls = new OrbitControls(camera,canvas)
  controls.enableDamping=true;
  controls.enableZoom = true; // Enable pinch zoom
  controls.enableRotate = true;
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
// });

let touchStartX = 0;
let touchStartY = 0;
let isTouching = false;

// Create a raycaster and a vector for the touch point
const raycaster = new THREE.Raycaster();
const touchVector = new THREE.Vector2();

window.addEventListener('touchstart', (e) => {
  // Get the initial touch position
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;

  // Convert to normalized device coordinates (-1 to +1)
  touchVector.x = (touchStartX / window.innerWidth) * 2 - 1;
  touchVector.y = -(touchStartY / window.innerHeight) * 2 + 1;

  // Set the raycaster position based on the touch position
  raycaster.setFromCamera(touchVector, camera);

  isTouching = true;
});

window.addEventListener('touchmove', (e) => {
  if (isTouching) {
    let touchMoveX = e.touches[0].clientX;
    let touchMoveY = e.touches[0].clientY;

    // Convert to normalized device coordinates (-1 to +1)
    touchVector.x = (touchMoveX / window.innerWidth) * 2 - 1;
    touchVector.y = -(touchMoveY / window.innerHeight) * 2 + 1;

    // Set the raycaster position based on the touch position
    raycaster.setFromCamera(touchVector, camera);

    // Cast the ray to get a 3D point on the screen
    const intersects = raycaster.intersectObject(groundPlane); // assuming you have a ground plane to limit player movement
    if (intersects.length > 0) {
      const intersectPoint = intersects[0].point;

      // Update the player position based on the intersected point
      player.position.x = intersectPoint.x;
      player.position.z = intersectPoint.z;
    }
  }
});

window.addEventListener('touchend', () => {
  isTouching = false;
});



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



      // let score = 0;
      // const scoreElement = document.createElement('div')
      // scoreElement.style.position =  'absolute';
      // scoreElement.style.top='10px'
      //   scoreElement.style.left='10px'
      //   scoreElement.style.color='white'
      //   scoreElement.style.fontSize= '2rem'
      //   scoreElement.innerHTML= `Score: ${score}`;

      // document.body.appendChild(scoreElement)
     
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
          speed += 0.0001;
        }
      }
      setInterval(increaseDifficulty, 40000);
      
      
    
      
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
      
      // Handle game over logic
      function triggerGameOver() {
        gameOver = true;
        
         // Pause the background music
  backgroundMusic.pause();

  // Play the game over sound
  gameOverSound.play();
        // Display the restart button
        const button = document.createElement('button');
        button.innerText = 'Restart Game';
        button.style.position = 'absolute';
        button.style.top = '80%';
        button.style.left = '50%';
        button.style.transform = 'translate(-50%, -50%)';
        button.style.padding = '15px 30px';
        button.style.fontSize = '24px';
        button.style.fontWeight = 'bold';
        button.style.backgroundColor = 'lightblue';
        button.style.border = 'none';
        button.style.borderRadius = '10px';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.transition = 'all 0.3s ease';
        
        button.onmouseover = () => button.style.backgroundColor = 'lightblue';
        button.onmouseout = () => button.style.backgroundColor = '#28a745';
      
        // Create game over overlay
        const gameOverOverlay = document.createElement("div");
        gameOverOverlay.style.position = "fixed";
        gameOverOverlay.style.top = "0";
        gameOverOverlay.style.left = "0";
        gameOverOverlay.style.width = "100%";
        gameOverOverlay.style.height = "100%";
        gameOverOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        gameOverOverlay.style.color = "#fff";
        gameOverOverlay.style.display = "flex";
        gameOverOverlay.style.flexDirection = "column";
        gameOverOverlay.style.justifyContent = "center";
        gameOverOverlay.style.alignItems = "center";
        gameOverOverlay.style.fontSize = "2rem";
        gameOverOverlay.innerHTML = `
          <p>Game Over!</p>
          <p>Your Final Score: ${score}</p>
          <p>Press R to Restart or Double Tap the button below</p>
        `;
        gameOverOverlay.appendChild(button); // Add the button to the overlay
      
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

        backgroundMusic.play()
      
        obstacles.forEach((obstacle, index) => {
          obstacle.position.z = -20 - index * 10;
          obstacle.passed = false;
        });
      
        // Remove the game over overlay
        const gameOverOverlay = document.querySelector("div");
        if (gameOverOverlay) {
          document.body.removeChild(gameOverOverlay);
        }
      
        scoreElement.innerHTML = `Score: ${score}`;
      
        // Restart the animation loop
        animate();
      }
      
      setInterval(updateScore, 100);
      
      

      
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
    updatePlayer()
    updateObstacles()
    increaseDifficulty()
    updateScore()
    checkGameOver(player, obstacles);
    controls.update()
    // checkCollision()
    updateHighway()
    // ground.position.z += speed;
    // if(ground.position.z > 10 ){
    //   ground.position.z =0;
    // }

    renderer.render(scene,camera)
  }
  animate()
}