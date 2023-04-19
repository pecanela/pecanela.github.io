// Configuração do Matter.js
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

var engine = Engine.create();
var render = Render.create({
  element: document.getElementById('container'),
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false
  }
});

var cube = Bodies.rectangle(100, 100, 100, 100, { restitution: 0.5 }); // Cria o cubo

// Adiciona o cubo ao mundo
World.add(engine.world, [cube]);

// Evento de clique no cubo
cube.addEventListener('click', function() {
  var forceMagnitude = 0.05; // Magnitude da força do clique
  var force = {
    x: forceMagnitude * Math.cos(cube.angle),
    y: forceMagnitude * Math.sin(cube.angle)
  };
  Body.applyForce(cube, cube.position, force); // Aplica a força no cubo
});

// Atualiza o motor de física do Matter.js
function update() {
  Engine.update(engine);
  requestAnimationFrame(update);
}

update();

// Atualiza o tamanho do canvas de renderização quando a janela é redimensionada
window.addEventListener('resize', function() {
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  Render.canvasSize(render);
});
