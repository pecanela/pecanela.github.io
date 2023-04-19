// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Textura do dado
const loader = new THREE.TextureLoader();
const texture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/crate.gif');

// Geometria e material do dado
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: texture });
const dice = new THREE.Mesh(geometry, material);
scene.add(dice);

// Configuração da posição e rotação inicial do dado
dice.position.set(0, 0, -5);
dice.rotation.set(0.4, 0.2, 0.1);

// Função para animar o dado
function animate() {
    requestAnimationFrame(animate);
    dice.rotation.x += 0.01;
    dice.rotation.y += 0.01;
    renderer.render(scene, camera);
}

// Evento de clique para interação com o dado
dice.addEventListener('click', () => {
    dice.rotation.x += 0.5;
    dice.rotation.y += 0.5;
});

// Iniciar animação
animate();
