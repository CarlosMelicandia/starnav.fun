// Create a starfield background
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: false
    });
  
    const starsCount = 10000;
    const positions = new Float32Array(starsCount * 3);
  
    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      // Create stars in a large sphere around the scene
      const radius = SPACE_SIZE * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
  
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  }
  
  // Create the sun
  function createSun() {
    const sunGeometry = new THREE.SphereGeometry(500, 64, 64); // Much larger sun
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xff5500,
      emissiveIntensity: 1
    });
    
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(0, 0, 0);
    
    // Add glow effect
    const sunGlowGeometry = new THREE.SphereGeometry(550, 64, 64);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff7700,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });
    
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sun.add(sunGlow);
    
    // Add bigger outer glow
    const outerGlowGeometry = new THREE.SphereGeometry(800, 64, 64);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    });
    
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    sun.add(outerGlow);
    
    scene.add(sun);
  }
  
  // Create planets of our solar system
  function createPlanets() {
    const planetData = [
      { name: "Mercury", radius: 50, distance: 1200, color: 0x888888, orbitSpeed: 0.01 },
      { name: "Venus", radius: 90, distance: 2200, color: 0xcc9966, orbitSpeed: 0.007 },
      { name: "Earth", radius: 100, distance: 3000, color: 0x3366ff, orbitSpeed: 0.005 },
      { name: "Mars", radius: 75, distance: 4500, color: 0xcc3300, orbitSpeed: 0.004 },
      { name: "Jupiter", radius: 250, distance: 7800, color: 0xccaa66, orbitSpeed: 0.002 },
      { name: "Saturn", radius: 200, distance: 11500, color: 0xddcc99, orbitSpeed: 0.0015, hasRings: true },
      { name: "Uranus", radius: 150, distance: 18000, color: 0x99ccff, orbitSpeed: 0.001 },
      { name: "Neptune", radius: 140, distance: 25000, color: 0x3355ff, orbitSpeed: 0.0007 },
    ];
  
    planetData.forEach(planetInfo => {
      const planetGeometry = new THREE.SphereGeometry(planetInfo.radius, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({ 
        color: planetInfo.color,
        shininess: 10,
      });
      
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Position planet
      const angle = Math.random() * Math.PI * 2;
      planet.position.set(
        Math.cos(angle) * planetInfo.distance,
        (Math.random() - 0.5) * 200, // Slight variation in y-axis
        Math.sin(angle) * planetInfo.distance
      );
      
      // Add orbit line
      const orbitGeometry = new THREE.RingGeometry(
        planetInfo.distance - 5, planetInfo.distance + 5, 128
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 'white',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
      });
      
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
      
      // Add atmospheric glow for Earth and Venus
      if (planetInfo.name === "Earth" || planetInfo.name === "Venus") {
        const atmosphereGeometry = new THREE.SphereGeometry(
          planetInfo.radius * 1.05, 
          32, 
          32
        );
        const atmosphereColor = planetInfo.name === "Earth" ? 0x6699ff : 0xffcc66;
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: atmosphereColor,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
      }
      
      // Add rings for Saturn
      if (planetInfo.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          planetInfo.radius * 1.3, 
          planetInfo.radius * 2.2, 
          64
        );
        const ringMaterial = new THREE.MeshPhongMaterial({
          color: 0xaa9966,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 3;
        planet.add(ring);
      }
      
      // Add some moons for some planets
      if (planetInfo.name === "Earth" || 
          planetInfo.name === "Mars" || 
          planetInfo.name === "Jupiter" || 
          planetInfo.name === "Saturn") {
        
        const moonCount = (planetInfo.name === "Jupiter" || planetInfo.name === "Saturn") ? 
                          3 + Math.floor(Math.random() * 4) : 1;
        
        for (let i = 0; i < moonCount; i++) {
          const moonSize = planetInfo.radius * (0.1 + Math.random() * 0.2);
          const moonDist = planetInfo.radius * (2 + Math.random() * 3);
          
          const moonGeometry = new THREE.SphereGeometry(moonSize, 16, 16);
          const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
          
          const moon = new THREE.Mesh(moonGeometry, moonMaterial);
          const moonAngle = Math.random() * Math.PI * 2;
          moon.position.set(
            Math.cos(moonAngle) * moonDist,
            (Math.random() - 0.5) * moonDist * 0.3,
            Math.sin(moonAngle) * moonDist
          );
          
          planet.add(moon);
        }
      }
      
      // Add label for the planet
      const labelCanvas = document.createElement('canvas');
      const labelContext = labelCanvas.getContext('2d');
      labelCanvas.width = 256;
      labelCanvas.height = 64;
  
      // Draw dark blue box with white border
      labelContext.fillStyle = '#000080'; // Dark blue
      labelContext.fillRect(0, 0, labelCanvas.width, labelCanvas.height);
      labelContext.strokeStyle = 'white'; // White border
      labelContext.lineWidth = 4;
      labelContext.strokeRect(0, 0, labelCanvas.width, labelCanvas.height);
  
      // Draw planet name in white
      labelContext.fillStyle = 'white';
      labelContext.font = '24px Arial';
      labelContext.textAlign = 'center';
      labelContext.textBaseline = 'middle';
      labelContext.fillText(planetInfo.name, labelCanvas.width / 2, labelCanvas.height / 2);
  
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: labelTexture });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(planetInfo.radius * 1.5, planetInfo.radius * 0.5, 1); // Adjust size relative to planet
      label.position.set(100, 10, 100); // Center the label in the middle of the planet
      planet.add(label);
      
      scene.add(planet);
      planets.push({
        mesh: planet,
        orbitRadius: planetInfo.distance,
        orbitSpeed: planetInfo.orbitSpeed,
        angle: angle
      });
    });
    
    // Add asteroid belt between Mars and Jupiter
    createAsteroidBelt(6000, 1000, 200);
  }
  
  // Create asteroid belt
  function createAsteroidBelt(centerRadius, width, count) {
    const asteroidGeometry = new THREE.IcosahedronGeometry(1, 0);
    const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    
    for (let i = 0; i < count; i++) {
      const scale = 10 + Math.random() * 40; // Larger asteroids
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
      
      asteroid.scale.set(scale, scale, scale);
      
      // Position in belt
      const angle = Math.random() * Math.PI * 2;
      const orbitRadius = centerRadius - width/2 + Math.random() * width;
      
      asteroid.position.set(
        Math.cos(angle) * orbitRadius,
        (Math.random() - 0.5) * 300,
        Math.sin(angle) * orbitRadius
      );
      
      asteroid.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(asteroid);
      
      // Also track asteroids in the planets array for animation
      planets.push({
        mesh: asteroid,
        orbitRadius: orbitRadius,
        orbitSpeed: 0.002 + Math.random() * 0.003,
        angle: angle,
        isAsteroid: true
      });
    }
  }
  
  // Update celestial bodies movement
  function updateCelestialBodies(deltaTime, now) {
    // Animate planets and moons in orbits
    planets.forEach(planet => {
      // Update orbit position
      planet.angle += planet.orbitSpeed * deltaTime * 10;
      
      // If it's just an asteroid, do simple orbit
      if (planet.isAsteroid) {
        planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;
        planet.mesh.rotation.y += 0.01 * deltaTime * 10;
        return;
      }
      
      // Full planet animation
      planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
      planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;
      planet.mesh.rotation.y += 0.2 * deltaTime;
      
      // Animate moons if any
      if (planet.mesh.children.length > 0) {
        planet.mesh.children.forEach((child, i) => {
          // Skip if it's a ring or atmosphere
          if (child.geometry.type === 'RingGeometry' || 
              (child.geometry.type === 'SphereGeometry' && child.material.transparent)) return;
          
          // Orbit each moon
          const moonAngle = now * 0.001 * (0.5 + i * 0.2);
          const moonDist = child.position.length();
          
          child.position.x = Math.cos(moonAngle) * moonDist;
          child.position.z = Math.sin(moonAngle) * moonDist;
          child.rotation.y += 0.5 * deltaTime;
        });
      }
    });
  }
  