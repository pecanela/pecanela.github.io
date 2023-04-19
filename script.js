// Importa a biblioteca Three.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.min.js';

// Cria uma cena
const scene = new THREE.Scene();

// Cria uma câmera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Cria um renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Cria um dado 3D
const loader = new THREE.TextureLoader();
const texture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/dice.jpg');
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ map: texture });
// const dice = new THREE.Mesh(geometry, material);
scene.add(dice);

// Função para animar o dado
function animate() {
    requestAnimationFrame(animate);

    // Gira o dado em torno dos eixos X, Y e Z
    dice.rotation.x += 0.01;
    dice.rotation.y += 0.01;
    dice.rotation.z += 0.01;

    renderer.render(scene, camera);
}
animate();

// Adiciona um ouvinte de eventos para girar o dado quando clicado
dice.addEventListener("click", function() {
    dice.rotation.x += Math.random() * 10;
    dice.rotation.y += Math.random() * 10;
    dice.rotation.z += Math.random() * 10;
});
