// Create a simple rocket model
function createRocket() {
    // Create rocket group
    rocket = new THREE.Group();
  
    // Create rocket body
    const bodyGeometry = new THREE.CylinderGeometry(5, 8, 40, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.rotation.x = Math.PI / 2; // Rotate 90 degrees around the Y-axis
    rocket.add(body);
  
    // Create nose cone
    const noseGeometry = new THREE.ConeGeometry(5, 15, 16);
    const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.z = 27.5;
    nose.rotation.x = Math.PI / 2; // Rotate 90 degrees around the Y-axis
    nose.castShadow = true;
    rocket.add(nose);
  
    // Create fins
    const finGeometry = new THREE.BoxGeometry(3, 15, 10);
    const finMaterial = new THREE.MeshPhongMaterial({ color: 0x3366cc });
  
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      fin.rotation.z = (i * Math.PI) / 2; // Rotate each fin around the Z-axisx
      fin.position.y = Math.cos(fin.rotation.z) * 10;
      fin.position.z = -20;
      fin.castShadow = true;
      rocket.add(fin);
    }
  
    // Create engine
    const engineGeometry = new THREE.CylinderGeometry(8, 6, 10, 16);
    const engineMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.position.z = -25;
    engine.rotation.x =  Math.PI / 2;
    engine.castShadow = true;
    rocket.add(engine);
    
    // Create thruster flame
    const flameGeometry = new THREE.ConeGeometry(6, 20, 16);
    const flameMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff7700,
      transparent: true,
      opacity: 0.7
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.z = -40;
    flame.rotation.x = -Math.PI / 2; // Rotate 90 degrees around the Y-axis
    
    rocket.add(flame);
    
    const smallFlameGeometry = new THREE.ConeGeometry(3, 10, 8);
    const smallFlameMaterial = new THREE.MeshBasicMaterial({ 
      color: 'yellow',
      transparent: false,
      opacity: 1
    });
    const smallFlame = new THREE.Mesh(smallFlameGeometry, smallFlameMaterial);
    smallFlame.position.z = -40;
    smallFlame.rotation.x = -Math.PI / 2; // Rotate 90 degrees around the Y-axis
    
    rocket.add(smallFlame);
  
    // Add to scene and position
    scene.add(rocket);
    rocket.position.set(-20000, 2200, 0); // Start near Earth orbit
    
    // Rotate rocket to point forward by default
    rocket.rotation.z = Math.PI; // Make the rocket upright
    rocket.rotation.y = Math.PI / 2; // Make it face forward initially
    rocket.rotation.order = 'YXZ'; // Prevent gimbal lock
  }
  
  // Update rocket movement and controls
  function updateRocket(deltaTime) {
    // Apply controls and physics - adjusted for behind-rocket view
    if (keys.ArrowUp) {
      rocket.rotation.x -= 0.03 * deltaTime * 60; // Pitch up
    }
    if (keys.ArrowDown) {
      rocket.rotation.x += 0.03 * deltaTime * 60; // Pitch down
    }
    if (keys.ArrowLeft) {
      rocket.rotation.y += 0.02 * deltaTime * 60; // Turn left
    }
    if (keys.ArrowRight) {
      rocket.rotation.y -= 0.02 * deltaTime * 60; // Turn right
    }
    if (keys.KeyW) {
      thrust = Math.min(thrust + 0.05 * deltaTime * 60, 3);
    }
    if (keys.KeyS) {
      thrust = Math.max(thrust - 0.05 * deltaTime * 60, 0.5);
    }
    if (keys.Space) {
      // Reset camera view
      cameraOffset = new THREE.Vector3(0, 20, -100);
    }
    
    // Calculate movement direction
    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyQuaternion(rocket.quaternion);
    
    // Apply movement
    rocket.position.add(direction.multiplyScalar(thrust * 8 * deltaTime * 60));
    
    // Animate thruster flame based on thrust
    const flame = rocket.children[5]; // Assuming flame is the 6th child
    flame.scale.set(
      0.8 + thrust * 0.2,
      0.5 + thrust * 0.5,
      0.8 + thrust * 0.2
    );
    
    // Gradual rotation recovery (auto-stabilization)
    rocket.rotation.z *= 0.98;
    
    // Keep rocket within the game world
    const boundaryLimit = SPACE_SIZE * 0.45;
    if (rocket.position.length() > boundaryLimit) {
      // Gradually turn rocket back toward center
      const centerDir = new THREE.Vector3()
        .subVectors(new THREE.Vector3(0, 0, 0), rocket.position)
        .normalize();
      
      // Create a subtle force pushing back toward center
      rocket.position.add(centerDir.multiplyScalar(0.5));
    }
  }
  