import * as THREE from 'three';

import { FBXLoader } from
'three/addons/loaders/FBXLoader.js';


// ===============================
// SCENE
// ===============================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050510);


// ===============================
// CAMERA
// ===============================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2.5, 7);

camera.lookAt(0, 1.5, 0);


// ===============================
// RENDERER
// ===============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);


// ===============================
// LIGHTING
// ===============================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    );

scene.add(ambientLight);


const mainLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

mainLight.position.set(
    5,
    10,
    5
);

mainLight.castShadow = true;

scene.add(mainLight);


// Blue rim light

const rimLight =
    new THREE.PointLight(
        0x3366ff,
        30,
        15
    );

rimLight.position.set(
    -4,
    4,
    -4
);

scene.add(rimLight);


// ===============================
// GROUND
// ===============================

const groundGeometry =
    new THREE.PlaneGeometry(
        50,
        50
    );

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x151515,
        roughness: 0.8
    });

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    );

ground.rotation.x =
    -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);


// ===============================
// 3D PLAYER
// ===============================

let player = null;

let mixer = null;

let animations = [];

const loader = new FBXLoader();


loader.load(

    './models/player/player.fbx',

    function (character) {

        console.log(
            "PLAYER LOADED!"
        );

        player = character;


        // Character size

        player.scale.set(
            0.01,
            0.01,
            0.01
        );


        // Position

        player.position.set(
            0,
            0,
            0
        );


        // Shadows

        player.traverse(
            function (object) {

                if (object.isMesh) {

                    object.castShadow = true;

                    object.receiveShadow = true;

                }

            }
        );


        scene.add(player);


        // ===============================
        // ANIMATION SYSTEM
        // ===============================

        if (
            character.animations &&
            character.animations.length > 0
        ) {

            mixer =
                new THREE.AnimationMixer(
                    player
                );

            animations =
                character.animations;

            console.log(
                "Animations found:",
                animations
            );


            // Play first animation

            const action =
                mixer.clipAction(
                    animations[0]
                );

            action.play();

        } else {

            console.log(
                "No animation found in player.fbx"
            );

        }

    },

    function (progress) {

        if (progress.total > 0) {

            console.log(
                "Loading:",
                Math.round(
                    progress.loaded /
                    progress.total * 100
                ) + "%"
            );

        }

    },

    function (error) {

        console.error(
            "PLAYER ERROR:",
            error
        );

    }

);


// ===============================
// ENERGY EFFECT
// ===============================

const energyGeometry =
    new THREE.SphereGeometry(
        0.15,
        16,
        16
    );

const energyMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x00ffff
    });

const energy =
    new THREE.Mesh(
        energyGeometry,
        energyMaterial
    );

energy.position.set(
    0,
    1.5,
    0
);

scene.add(energy);


// ===============================
// CONTROLS
// ===============================

const keys = {};

window.addEventListener(
    'keydown',
    function (event) {

        keys[event.key.toLowerCase()] = true;

    }
);


window.addEventListener(
    'keyup',
    function (event) {

        keys[event.key.toLowerCase()] = false;

    }
);


// ===============================
// CLOCK
// ===============================

const clock =
    new THREE.Clock();


// ===============================
// GAME LOOP
// ===============================

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    // Update character animations

    if (mixer) {

        mixer.update(delta);

    }


    // ===============================
    // PLAYER MOVEMENT
    // ===============================

    if (player) {

        const speed =
            3 * delta;


        if (keys['w']) {

            player.position.z -= speed;

        }


        if (keys['s']) {

            player.position.z += speed;

        }


        if (keys['a']) {

            player.position.x -= speed;

        }


        if (keys['d']) {

            player.position.x += speed;

        }


        // Face movement direction

        if (keys['a']) {

            player.rotation.y =
                Math.PI / 2;

        }


        if (keys['d']) {

            player.rotation.y =
                -Math.PI / 2;

        }


        if (keys['w']) {

            player.rotation.y = 0;

        }


        if (keys['s']) {

            player.rotation.y =
                Math.PI;

        }

    }


    // ===============================
    // ENERGY ANIMATION
    // ===============================

    const time =
        Date.now() * 0.005;


    energy.scale.setScalar(
        1 +
        Math.sin(time) * 0.3
    );


    energy.position.y =
        1.5 +
        Math.sin(time) * 0.1;


    // ===============================
    // CAMERA FOLLOW
    // ===============================

    if (player) {

        const targetX =
            player.position.x;

        const targetZ =
            player.position.z + 7;


        camera.position.x +=
            (
                targetX -
                camera.position.x
            ) * 0.05;


        camera.position.z +=
            (
                targetZ -
                camera.position.z
            ) * 0.05;


        camera.lookAt(
            player.position.x,
            1.5,
            player.position.z
        );

    }


    renderer.render(
        scene,
        camera
    );

}


animate();


// ===============================
// WINDOW RESIZE
// ===============================

window.addEventListener(
    'resize',
    function () {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);
