(() => {
	// Configurações iniciais
	const bgUrl = 'espaco.jpg';           // URL da imagem de fundo
	const blackholeMass = 100;            // Massa máxima para o efeito
	let curBlackholeMass = 0;             // Massa atual para a animação
  
	let canvas, gl, program;
	let locationOfTime, locationOfResolution, locationOfMouse, locationOfMass;
	let mouse = { x: 0, y: 0, moved: false };
	let startTime = performance.now();    // Hora inicial usando performance.now()
	let currentTime = 0;
	let audio, playPauseButton;
	let hasUserInteracted = false;        // Controla se já houve interação para o áudio
  
	/**
	 * Inicializa o contexto WebGL, shaders, buffers e inicia o loop de renderização.
	 * @param {HTMLImageElement} image - Imagem de fundo carregada.
	 */
	function init(image) {
	  // Obtém o canvas e o contexto WebGL
	  canvas = document.getElementById('glscreen');
	  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	  resizeCanvas(); // Ajusta o canvas ao tamanho da janela
  
	  // Inicializa a posição do mouse no centro do canvas
	  mouse.x = canvas.width / 2;
	  mouse.y = canvas.height / 2;
	  gl.viewport(0, 0, canvas.width, canvas.height);
  
	  // Cria um buffer único intercalando coordenadas de vértice (x, y) e coordenadas de textura (u, v)
	  const vertices = new Float32Array([
		// Primeiro triângulo
		-1.0, -1.0,  0.0, 0.0,  // bottom-left
		 1.0, -1.0,  1.0, 0.0,  // bottom-right
		-1.0,  1.0,  0.0, 1.0,  // top-left
  
		// Segundo triângulo
		-1.0,  1.0,  0.0, 1.0,  // top-left
		 1.0, -1.0,  1.0, 0.0,  // bottom-right
		 1.0,  1.0,  1.0, 1.0   // top-right
	  ]);
	  const vertexBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
	  // Recupera o código dos shaders (os scripts estão no HTML)
	  const vertexShaderSource = document.getElementById('2d-vertex-shader').textContent;
	  const fragmentShaderSource = document.getElementById('2d-fragment-shader').textContent;
  
	  // Cria e compila os shaders
	  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
	  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  
	  // Cria e vincula o programa de shader
	  program = createProgram(vertexShader, fragmentShader);
	  gl.useProgram(program);
  
	  // Configura os atributos usando o buffer intercalado:
	  // Cada vértice possui 4 floats: 2 para posição (x,y) e 2 para coordenadas de textura (u,v).
	  const positionLocation = gl.getAttribLocation(program, 'a_position');
	  gl.enableVertexAttribArray(positionLocation);
	  gl.vertexAttribPointer(
		positionLocation,
		2,
		gl.FLOAT,
		false,
		4 * Float32Array.BYTES_PER_ELEMENT,
		0
	  );
  
	  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
	  gl.enableVertexAttribArray(texCoordLocation);
	  gl.vertexAttribPointer(
		texCoordLocation,
		2,
		gl.FLOAT,
		false,
		4 * Float32Array.BYTES_PER_ELEMENT,
		2 * Float32Array.BYTES_PER_ELEMENT
	  );
  
	  // Obtém as localizações dos uniforms e os inicializa
	  getLocations();
	  setUniforms(image);
  
	  addEventListeners();
	  render();
  
	  // Inicializa o áudio e o botão play/pause
	  audio = document.getElementById('background-audio');
	  playPauseButton = document.getElementById('play-pause-button');
	  attemptToPlayAudio();
  
	  playPauseButton.addEventListener('click', () => {
		if (audio.paused) {
		  audio.play();
		  playPauseButton.textContent = '⏸️';
		} else {
		  audio.pause();
		  playPauseButton.textContent = '▶️';
		}
	  });
	}
  
	/**
	 * Tenta reproduzir o áudio e trata bloqueios de autoplay.
	 */
	function attemptToPlayAudio() {
	  audio.play().then(() => {
		playPauseButton.style.display = 'none';
	  }).catch((error) => {
		console.log('Autoplay bloqueado:', error);
		playPauseButton.style.display = 'block';
		playPauseButton.textContent = '▶️';
		if (!hasUserInteracted) {
		  window.addEventListener('click', onUserInteraction);
		  hasUserInteracted = true;
		}
	  });
	}
  
	/**
	 * Tenta reproduzir o áudio após interação do usuário.
	 */
	function onUserInteraction() {
	  audio.play().then(() => {
		playPauseButton.style.display = 'none';
		window.removeEventListener('click', onUserInteraction);
	  }).catch((error) => {
		console.log('Reprodução ainda bloqueada após interação:', error);
	  });
	}
  
	/**
	 * Cria e compila um shader.
	 * @param {GLenum} type - O tipo de shader (VERTEX ou FRAGMENT).
	 * @param {string} source - O código GLSL do shader.
	 * @returns {WebGLShader|null} - O shader compilado ou null em caso de erro.
	 */
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
  
	/**
	 * Cria e vincula o programa de shader.
	 * @param {WebGLShader} vertexShader - O shader de vértice compilado.
	 * @param {WebGLShader} fragmentShader - O shader de fragmento compilado.
	 * @returns {WebGLProgram|null} - O programa vinculado ou null em caso de erro.
	 */
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
  
	/**
	 * Obtém as localizações dos uniforms usados no shader.
	 */
	function getLocations() {
	  locationOfResolution = gl.getUniformLocation(program, 'u_resolution');
	  locationOfMouse = gl.getUniformLocation(program, 'u_mouse');
	  locationOfMass = gl.getUniformLocation(program, 'u_mass');
	  locationOfTime = gl.getUniformLocation(program, 'u_time');
  
	  // Define o uniform do sampler para a unidade 0 (u_image)
	  const locationOfImage = gl.getUniformLocation(program, 'u_image');
	  gl.uniform1i(locationOfImage, 0);
	}
  
	/**
	 * Define os valores iniciais dos uniforms e configura a textura.
	 * @param {HTMLImageElement} image - Imagem a ser usada como textura.
	 */
	function setUniforms(image) {
	  gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	  gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	  gl.uniform1f(locationOfMass, curBlackholeMass * 0.00001);
	  gl.uniform1f(locationOfTime, currentTime);
  
	  // Configura a textura
	  const texture = gl.createTexture();
	  gl.activeTexture(gl.TEXTURE0);
	  gl.bindTexture(gl.TEXTURE_2D, texture);
  
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}
  
	/**
	 * Adiciona event listeners para o movimento do mouse e redimensionamento da janela.
	 */
	function addEventListeners() {
	  // Atualiza a posição do mouse
	  canvas.addEventListener('mousemove', (e) => {
		const rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = canvas.height - (e.clientY - rect.top); // Inverte o eixo Y
		mouse.moved = true;
	  });
  
	  // Aplica debounce ao evento de resize
	  let resizeTimeout;
	  window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(onResize, 100);
	  });
	}
  
	/**
	 * Redimensiona o canvas e atualiza o viewport e uniform de resolução.
	 */
	function resizeCanvas() {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  gl.viewport(0, 0, canvas.width, canvas.height);
	  if (locationOfResolution) {
		gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	  }
	}
  
	/**
	 * Função chamada no evento de resize.
	 */
	function onResize() {
	  resizeCanvas();
	}
  
	/**
	 * Loop principal de renderização.
	 */
	function render() {
	  currentTime = (performance.now() - startTime) / 1000;
  
	  // Aumenta gradualmente a massa para um efeito suave
	  if (curBlackholeMass < blackholeMass - 50) {
		curBlackholeMass += (blackholeMass - curBlackholeMass) * 0.03;
	  }
  
	  // Se o mouse não se moveu, anima sua posição para manter a dinâmica visual
	  if (!mouse.moved) {
		mouse.y = (canvas.height / 2) + Math.sin(currentTime * 0.7) * (canvas.height * 0.25);
		mouse.x = (canvas.width / 2) + Math.sin(currentTime * 0.6) * (canvas.width * 0.35);
	  }
  
	  // Atualiza os uniforms com os valores atuais
	  gl.uniform1f(locationOfMass, curBlackholeMass * 0.00001);
	  gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	  gl.uniform1f(locationOfTime, currentTime);
  
	  // Desenha a cena (dois triângulos formando um retângulo)
	  gl.drawArrays(gl.TRIANGLES, 0, 6);
	  requestAnimationFrame(render);
	}
  
	// Inicializa a simulação após o carregamento completo da página
	window.addEventListener('load', () => {
	  const image = new Image();
	  image.crossOrigin = 'Anonymous';
	  image.src = bgUrl;
	  image.onload = () => init(image);
	});
  })();
  