// Game variables
let scene, camera, renderer, rocket;
let planets = [];
let score = 0;
let thrust = 1;
let previousTime;

// Initialize the game
function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000010); // Dark space blue

  // Create camera (third person POV)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    SPACE_SIZE
  );
  camera.position.set(-18000, 2000, 300);
  camera.lookAt(0, 0, 0);

  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("game-canvas"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
  scene.add(ambientLight);

  // Sun light (point light at center)
  const sunLight = new THREE.PointLight(0xffffcc, 1.5, SPACE_SIZE);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Create starfield
  createStarfield();

  // Create sun
  createSun();

  // Create planets
  createPlanets();

  // Create labels
  createLabel();

  // Create rocket model
  createRocket();

  // Initialize controls
  initControls();

  // Start game loop
  animate();
}

// Update game physics and controls
function updateGame() {
  // Calculate delta time for smooth movement
  const now = Date.now();
  const deltaTime = (now - (previousTime || now)) / 1000;
  previousTime = now;
  
  // Update rocket movement
  updateRocket(deltaTime);
  
  // Update celestial bodies
  updateCelestialBodies(deltaTime, now);
  
  // Update camera
  updateCamera();
}

// Game loop
function animate() {
  requestAnimationFrame(animate);
  updateGame();
  renderer.render(scene, camera);
}

// Start the game
init();
