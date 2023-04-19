// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carregar modelo do dado
const loader = new THREE.GLTFLoader();
loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Dice.gltf', function (gltf) {
    scene.add(gltf.scene);

    // Configuração da posição e rotação inicial do dado
    gltf.scene.position.set(0, 0, -5);
    gltf.scene.rotation.set(0.4, 0.2, 0.1);
});

// Configuração da posição da câmera
camera.position.z = 5;

// Função para animar o dado
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Evento de clique para interação com o dado
document.addEventListener('click', function () {
    scene.rotation.x += 0.5;
    scene.rotation.y += 0.5;
});

// Iniciar animação
animate();
// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Carregar modelo do dado
const loader = new THREE.GLTFLoader();
loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/Dice.gltf', function (gltf) {
    scene.add(gltf.scene);

    // Configuração da posição e rotação inicial do dado
    gltf.scene.position.set(0, 0, -5);
    gltf.scene.rotation.set(0.4, 0.2, 0.1);
});

// Configuração da posição da câmera
camera.position.z = 5;

// Função para animar o dado
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Evento de clique para interação com o dado
document.addEventListener('click', function () {
    scene.rotation.x += 0.5;
    scene.rotation.y += 0.5;
});

// Iniciar animação
animate();
