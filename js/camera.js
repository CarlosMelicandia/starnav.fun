// Camera control
let cameraOffset = new THREE.Vector3(0, 20, -100); // Position more directly behind
let cameraTarget = new THREE.Vector3();
let cameraLerp = 0.05; // Camera smoothing factor

// Position camera behind the rocket
function updateCamera() {
  // Calculate ideal camera position - directly behind the rocket
  const idealOffset = cameraOffset.clone().applyQuaternion(rocket.quaternion);
  const idealPosition = rocket.position.clone().add(idealOffset);
  
  // Smoothly move camera toward ideal position
  camera.position.lerp(idealPosition, cameraLerp);
  
  // Look directly at the rocket, slightly ahead
  const lookAheadOffset = new THREE.Vector3(0, 0, 50).applyQuaternion(rocket.quaternion);
  cameraTarget.copy(rocket.position).add(lookAheadOffset);
  
  camera.lookAt(cameraTarget);
}
