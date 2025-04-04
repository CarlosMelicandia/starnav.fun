function createLabel(planetInfo) {
    // Debugging: Log the planetInfo object
    console.log("Creating label for:", planetInfo);
  
    if (!planetInfo || !planetInfo.name) {
      console.error("Invalid planetInfo object passed to createLabel:", planetInfo);
      return null; // Return null if planetInfo is invalid
    }
  
    // Create canvas for the label
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
  
    // Create a sprite with the canvas texture
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.SpriteMaterial({ 
      map: labelTexture,
      sizeAttenuation: true
    });
    
    const label = new THREE.Sprite(labelMaterial);
    
    // Scale based on planet radius
    label.scale.set(
      planetInfo.radius * 1.5, 
      planetInfo.radius * 0.5, 
      1
    );
    
    // Position above the planet
    label.position.set(0, 0, 0);
    
    return label;
  }
  