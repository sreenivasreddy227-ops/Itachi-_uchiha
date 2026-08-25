import * as THREE from
'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050510);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 3, 8);
camera.lookAt(0, 1.5, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 5);
light.castShadow = true;

scene.add(light);

// Ground
const groundGeometry = new THREE.PlaneGeometry(30, 30);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x202020
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

// Anime fighter
const fighter = new THREE.Group();
scene.add(fighter);

// Body
const bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.2, 8, 16);

const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111
});

const body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
);

body.position.y = 1.4;
body.castShadow = true;

fighter.add(body);

// Head
const headGeometry = new THREE.SphereGeometry(0.45, 32, 32);

const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc9a5
});

const head = new THREE.Mesh(
    headGeometry,
    headMaterial
);

head.position.y = 2.55;
head.castShadow = true;

fighter.add(head);

// Sword
const sword = new THREE.Group();

const bladeGeometry = new THREE.BoxGeometry(
    0.12,
    2.5,
    0.08
);

const bladeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.8,
    roughness: 0.2
});

const blade = new THREE.Mesh(
    bladeGeometry,
    bladeMaterial
);

blade.position.y = 1.25;

sword.add(blade);

// Handle
const handleGeometry = new THREE.CylinderGeometry(
    0.08,
    0.08,
    0.6,
    16
);

const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x552200
});

const handle = new THREE.Mesh(
    handleGeometry,
    handleMaterial
);

handle.position.y = -0.3;

sword.add(handle);

sword.position.set(0.8, 1.4, 0);
sword.rotation.z = -0.5;

fighter.add(sword);

// Energy effect
const energyGeometry = new THREE.SphereGeometry(
    0.15,
    16,
    16
);

const energyMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff
});

const energy = new THREE.Mesh(
    energyGeometry,
    energyMaterial
);

energy.position.set(0, 1.5, 0);

scene.add(energy);

// Animation
let attacking = false;
let attackTime = 0;

window.addEventListener("click", () => {

    if (!attacking) {
        attacking = true;
        attackTime = 0;
    }

});

function animate() {

    requestAnimationFrame(animate);

    // Idle animation
    fighter.position.y =
        Math.sin(Date.now() * 0.003) * 0.05;

    // Energy movement
    energy.scale.setScalar(
        1 + Math.sin(Date.now() * 0.01) * 0.3
    );

    // Sword attack
    if (attacking) {

        attackTime += 0.08;

        sword.rotation.z =
            -0.5 + Math.sin(attackTime * 8) * 1.5;

        if (attackTime > Math.PI) {
            attacking = false;
            sword.rotation.z = -0.5;
        }
    }

    renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
