// Variáveis para o canvas e contexto
const canvas = document.getElementById('diceCanvas');
const ctx = canvas.getContext('2d');

// Variáveis para o movimento do dado
let rollDirection = '';
let rollSpeed = 0;
let rollDistance = 0;
let rollTotalDistance = 0;
let rollInterval;

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

// Função para rolar o dado
function rollDice() {
    if (!rollDirection) {
        // Gerar um número aleatório de 1 a 6
        const rollResult = Math.ceil(Math.random() * 6);
        console.log('Rolled', rollResult);

        // Definir a direção do rolamento
        switch (rollResult) {
            case 1:
                rollDirection = 'down';
                break;
            case 2:
                rollDirection = 'up';
                break;
            case 3:
                rollDirection = 'right';
                break;
            case 4:
                rollDirection = 'left';
                break;
            case 5:
                rollDirection = 'forward';
                break;
            case 6:
                rollDirection = 'backward';
                break;
        }

        // Definir a velocidade e distância do rolamento
        rollSpeed = 10;
        rollDistance = 100 + Math.ceil(Math.random() * 100);
        rollTotalDistance = 0;

        // Iniciar o intervalo de rolamento
        rollInterval = setInterval(() => {
            if (rollTotalDistance >= rollDistance) {
                // Parar o intervalo de rolamento quando a distância total for atingida
                clearInterval(rollInterval);
                rollDirection = '';
                return;
            }

            // Desenhar o dado em sua posição atual
            drawDice();

            // Movimentar o dado na direção correta
            switch (rollDirection) {
                case 'down':
                    ctx.translate(0, rollSpeed);
                    rollTotalDistance += rollSpeed;
                    break;
                case 'up':
                    ctx.translate(0, -rollSpeed);
                    rollTotalDistance += rollSpeed;
                    break;
                case 'right':
                    ctx.translate(rollSpeed, 0);
                    rollTotalDistance += rollSpeed;
                    break;
                case 'left':
                    ctx.translate(-rollSpeed, 0);
                    rollTotalDistance += rollSpeed;
                    break;
                case 'forward':
                    ctx.translate(0, 0, rollSpeed);
                    rollTotalDistance += rollSpeed;
                    break;
                case 'backward':
                    ctx.translate(0, 0, -rollSpeed);
                    rollTotalDistance += rollSpeed;
                    break;
            }
        }, 20);
    }
}

// Adicionar evento de clique no canvas para rolar o dado
canvas.addEventListener('click', rollDice);

// Desenhar o dado inicialmente
drawDice();

