const cubo = document.getElementById('cubo');
let dragging = false;
let posInicialX, posInicialY;
let rotacaoX = 0;
let rotacaoY = 0;
let velocidadeX = 0;
let velocidadeY = 0;
const amortecimento = 0.1;

cubo.addEventListener('mousedown', (event) => {
    dragging = true;
    posInicialX = event.clientX;
    posInicialY = event.clientY;
    velocidadeX = 0;
    velocidadeY = 0;
});

document.addEventListener('mousemove', (event) => {
    if (dragging) {
        const difX = event.clientX - posInicialX;
        const difY = event.clientY - posInicialY;
        rotacaoX += difY * 0.01;
        rotacaoY += difX * 0.01;
        cubo.style.transform = `rotateX(${rotacaoX}rad) rotateY(${rotacaoY}rad)`;
        velocidadeX = difX;
        velocidadeY = difY;
        posInicialX = event.clientX;
        posInicialY = event.clientY;
    }
});

document.addEventListener('mouseup', () => {
    dragging = false;
});

document.addEventListener('mouseout', () => {
    dragging = false;
});

function atualizarCubo() {
    if (!dragging) {
        velocidadeX *= (1 - amortecimento);
        velocidadeY *= (1 - amortecimento);
        rotacaoX += velocidadeY * 0.01;
        rotacaoY += velocidadeX * 0.01;
        cubo.style.transform = `rotateX(${rotacaoX}rad) rotateY(${rotacaoY}rad)`;
    }
    requestAnimationFrame(atualizarCubo);
}

requestAnimationFrame(atualizarCubo);

cubo.addEventListener('click', () => {
    cubo.style.transition = 'transform 1s';
    cubo.style.transform = `rotateX(${rotacaoX + Math.PI}rad) rotateY(${rotacaoY + Math.PI}rad)`;
});
