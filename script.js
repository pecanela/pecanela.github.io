// Configuração inicial da cena
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criação do cubo
var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.set(0, 0, -5); // Define a posição inicial do cubo

// Função para atualizar a rotação do cubo
function updateRotation() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
}

// Função para lidar com o clique no cubo
function onCubeClick() {
    cube.rotation.x += Math.random() * Math.PI * 2; // Rotaciona aleatoriamente em torno do eixo x
    cube.rotation.y += Math.random() * Math.PI * 2; // Rotaciona aleatoriamente em torno do eixo y
    cube.rotation.z += Math.random() * Math.PI * 2; // Rotaciona aleatoriamente em torno do eixo z
}

// Adiciona o evento de clique no cubo
cube.addEventListener('click', onCubeClick);

// Função de renderização
function animate() {
    requestAnimationFrame(animate);
    updateRotation();
    renderer.render(scene, camera);
}
animate();
