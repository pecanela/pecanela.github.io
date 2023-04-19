const cubo = document.getElementById('cubo');
let dragging = false;
let posInicialX, posInicialY;
let rotacaoX = 0;
let rotacaoY = 0;

cubo.addEventListener('mousedown', (event) => {
    dragging = true;
    posInicialX = event.clientX;
    posInicialY = event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (dragging) {
        const difX = event.clientX - posInicialX;
        const difY = event.clientY - posInicialY;
        rotacaoX += difY * 0.01;
        rotacaoY += difX * 0.01;
        cubo.style.transform = `rotateX(${rotacaoX}rad) rotateY(${rotacaoY}rad)`;
        posInicialX = event.clientX;
        posInicialY = event.clientY;
    }
});

document.addEventListener('mouseup', () => {
    dragging = false;
});

cubo.addEventListener('click', () => {
    cubo.style.transition = 'transform 1s';
    cubo.style.transform = `rotateX(${rotacaoX + Math.PI}rad) rotateY(${rotacaoY + Math.PI}rad)`;
});
