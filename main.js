// Import functions to initialize the landing page and game scene
import { createHeroScene } from './src/scene';
import { initializeLandingPageScene } from './src/landingpage';

// Select the hero container, landing page, and game page containers
const landingPage = document.getElementById('game-overlay');
const gamePage = document.getElementById('hero');


// Initialize the landing page Three.js scene
// initializeLandingPageScene(landingPage);

// Handle the start button click to transition to the game page
const startButton = document.getElementById('startButton');
if (startButton) {
  startButton.addEventListener('click', () => {
    // Hide the landing page and show the game page
    landingPage.remove();
    gamePage.style.display = 'block';

    // Initialize the hero game scene inside the game page
    createHeroScene(gamePage);
  });
}
