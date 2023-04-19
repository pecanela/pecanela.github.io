// Variáveis para o canvas e contexto
const canvas = document.getElementById('diceCanvas');
const ctx = canvas.getContext('2d');

// Função para desenhar o dado 3D
function drawDice() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(50, 50, 300, 300);
    ctx.strokeRect(50, 50, 300, 300);

    // Pontos do dado
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(100, 100, 20, 0, Math.PI * 2);
    ctx.arc(200, 100, 20, 0, Math.PI * 2);
    ctx.arc(300, 100, 20, 0, Math.PI * 2);
    ctx.arc(100, 300, 20, 0, Math.PI * 2);
    ctx.arc(200, 300, 20, 0, Math.PI * 2);
    ctx.arc(300, 300, 20, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
}

// Função para rolar o dado quando o canvas é clicado
canvas.addEventListener('click', function () {
    drawDice();
});

// Chamar a função de desenhar o dado 3D inicialmente
drawDice();
