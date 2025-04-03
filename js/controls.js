// Controls state
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyS: false,
    Space: false,
  };
  
  // Initialize controls
  function initControls() {
    window.addEventListener("keydown", (e) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
      }
    });
    
    window.addEventListener("keyup", (e) => {
      if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
      }
    });
    
    window.addEventListener("resize", onWindowResize);
  }
  
  // Window resize handler
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  