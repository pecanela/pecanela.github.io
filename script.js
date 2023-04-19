// Adicione interação de clique para rodar o dado
const cube = document.querySelector('.cube');
cube.addEventListener('click', () => {
  cube.style.transform = `rotateX(${getRandomInt(1, 7) * 360}deg) rotateY(${getRandomInt(1, 7) * 360}deg)`;
});

// Função utilitária para obter um número inteiro aleatório entre um intervalo
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
