// Fondo 3D con Three.js - Partículas flotantes

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 4000);
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-bg'), alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let particleCount = 800;
let particles = [];
let geometry = new THREE.BufferGeometry();
let positions = new Float32Array(particleCount * 3);
let velocities = [];

for (let i = 0; i < particleCount; i++) {
  positions[3*i] = (Math.random() - 0.5) * window.innerWidth;
  positions[3*i+1] = (Math.random() - 0.5) * window.innerHeight;
  positions[3*i+2] = (Math.random() - 0.5) * window.innerWidth / 2;
  velocities.push({
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    vz: (Math.random() - 0.5) * 0.5
  });
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
let material = new THREE.PointsMaterial({ color: 0x00aaff, size: 2 });
let pointCloud = new THREE.Points(geometry, material);
scene.add(pointCloud);

function animate() {
  requestAnimationFrame(animate);

  let pos = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    let p = velocities[i];
    pos[3*i] += p.vx;
    pos[3*i+1] += p.vy;
    pos[3*i+2] += p.vz;

    if (pos[3*i] > window.innerWidth/2 || pos[3*i] < -window.innerWidth/2) p.vx *= -1;
    if (pos[3*i+1] > window.innerHeight/2 || pos[3*i+1] < -window.innerHeight/2) p.vy *= -1;
    if (pos[3*i+2] > window.innerWidth/2 || pos[3*i+2] < -window.innerWidth/2) p.vz *= -1;
  }
  geometry.attributes.position.needsUpdate = true;
  pointCloud.rotation.y += 0.0005;
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});