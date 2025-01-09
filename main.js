import { createHeroScene } from './src/scene';
import { initializeLandingPageScene } from './src/landingpage';


// Select the hero container
const heroContainer = document.getElementById('hero')
const landingPage = document.getElementById('landingPage');
const gamePage = document.getElementById('gamePage');

// const container = document.getElementById('features')
// Initialize the hero Three.js scene

initializeLandingPageScene(landingPage)


const startButton = document.getElementById('startButton');
if (startButton) {
  startButton.addEventListener('click', () => {
    // Hide the landing page and show the game page
    landingPage.style.display = 'none';
    gamePage.style.display = 'block';

    // Initialize the game scene
    createHeroScene(gamePage); // This ensures the game starts in the game page container
  });
}