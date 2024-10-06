(() => {
	const bgUrl = 'espaco.jpg';
	const blackholeMass = 100;
	let curBlackholeMass = 0;
  
	let canvas, gl, program;
	let locationOfTime, locationOfResolution, locationOfMouse, locationOfMass;
	let mouse = { x: 0, y: 0, moved: false };
	let startTime = Date.now();
	let currentTime = 0;
  
	function init(image) {
	  canvas = document.getElementById('glscreen');
	  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
	  resizeCanvas(); // Inicializa o tamanho do canvas
  
	  mouse.x = canvas.width / 2;
	  mouse.y = canvas.height / 2;
  
	  // Configuração do viewport
	  gl.viewport(0, 0, canvas.width, canvas.height);
  
	  // Buffer de posição
	  const positionBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	  gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
		  -1.0, -1.0,
		   1.0, -1.0,
		  -1.0,  1.0,
		  -1.0,  1.0,
		   1.0, -1.0,
		   1.0,  1.0
		]),
		gl.STATIC_DRAW
	  );
  
	  // Obtenha os shaders
	  const vertexShaderSource = document.getElementById('vertex-shader').textContent;
	  const fragmentShaderSource = document.getElementById('fragment-shader').textContent;
  
	  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
	  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  
	  program = createProgram(vertexShader, fragmentShader);
	  gl.useProgram(program);
  
	  // Localizações dos atributos
	  const positionLocation = gl.getAttribLocation(program, 'a_position');
	  gl.enableVertexAttribArray(positionLocation);
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
	  getLocations();
	  setUniforms(image);
  
	  addEventListeners();
	  render();
	}
  
	function createShader(type, source) {
	  const shader = gl.createShader(type);
	  gl.shaderSource(shader, source);
	  gl.compileShader(shader);
  
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('Erro ao compilar shader:', gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	  }
	  return shader;
	}
  
	function createProgram(vertexShader, fragmentShader) {
	  const prog = gl.createProgram();
	  gl.attachShader(prog, vertexShader);
	  gl.attachShader(prog, fragmentShader);
	  gl.linkProgram(prog);
  
	  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.error('Erro ao linkar programa:', gl.getProgramInfoLog(prog));
		gl.deleteProgram(prog);
		return null;
	  }
	  return prog;
	}
  
	function getLocations() {
	  locationOfResolution = gl.getUniformLocation(program, 'u_resolution');
	  locationOfMouse = gl.getUniformLocation(program, 'u_mouse');
	  locationOfMass = gl.getUniformLocation(program, 'u_mass');
	  locationOfTime = gl.getUniformLocation(program, 'u_time');
	}
  
	function setUniforms(image) {
	  gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	  gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	  gl.uniform1f(locationOfMass, curBlackholeMass * 0.00001);
	  gl.uniform1f(locationOfTime, currentTime);
  
	  // Coordenadas de textura
	  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
	  const texCoordBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	  gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
		  0.0, 0.0,
		  1.0, 0.0,
		  0.0, 1.0,
		  0.0, 1.0,
		  1.0, 0.0,
		  1.0, 1.0
		]),
		gl.STATIC_DRAW
	  );
	  gl.enableVertexAttribArray(texCoordLocation);
	  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  
	  // Configuração da textura
	  const texture = gl.createTexture();
	  gl.bindTexture(gl.TEXTURE_2D, texture);
  
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}
  
	function addEventListeners() {
	  // Removemos os eventos de clique para desabilitar o efeito de clique
	  canvas.addEventListener('mousemove', (e) => {
		const rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = canvas.height - (e.clientY - rect.top);
		mouse.moved = true;
	  });
  
	  window.addEventListener('resize', onResize);
	}
  
	function resizeCanvas() {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  gl.viewport(0, 0, canvas.width, canvas.height);
	  gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	}
  
	function onResize() {
	  resizeCanvas();
	}
  
	function render() {
	  currentTime = (Date.now() - startTime) / 1000;
  
	  if (curBlackholeMass < blackholeMass - 50) {
		curBlackholeMass += (blackholeMass - curBlackholeMass) * 0.03;
	  }
  
	  if (!mouse.moved) {
		mouse.y = (canvas.height / 2) + Math.sin(currentTime * 0.7) * (canvas.height * 0.25);
		mouse.x = (canvas.width / 2) + Math.sin(currentTime * 0.6) * (canvas.width * 0.35);
	  }
  
	  gl.uniform1f(locationOfMass, curBlackholeMass * 0.00001);
	  gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	  gl.uniform1f(locationOfTime, currentTime);
  
	  gl.drawArrays(gl.TRIANGLES, 0, 6);
	  requestAnimationFrame(render);
	}
  
	window.addEventListener('load', () => {
	  const image = new Image();
	  image.crossOrigin = 'Anonymous';
	  image.src = bgUrl;
	  image.onload = () => init(image);
	});
  })();
  