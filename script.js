(() => {
	// URL of the background image
	const bgUrl = 'space.jpg';
	// Maximum mass of the black hole
	const blackholeMass = 100;
	// Current mass, starts at zero for animation effect
	let curBlackholeMass = 0;
  
	// Variables for canvas, WebGL context, and shader program
	let canvas, gl, program;
	// Locations of uniform variables in shaders
	let locationOfTime, locationOfResolution, locationOfMouse, locationOfMass;
	// Mouse object to track position and movement
	let mouse = { x: 0, y: 0, moved: false };
	// Timing variables
	let startTime = Date.now();
	let currentTime = 0;
  
	/**
	 * Initializes the WebGL context, shaders, buffers, and starts the render loop.
	 * @param {HTMLImageElement} image - The background image to be used as texture.
	 */
	function init(image) {
	  // Get the canvas element and WebGL context
	  canvas = document.getElementById('glscreen');
	  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
	  // Set the canvas size to match the window
	  resizeCanvas();
  
	  // Initialize mouse position to the center of the canvas
	  mouse.x = canvas.width / 2;
	  mouse.y = canvas.height / 2;
  
	  // Set the viewport to cover the entire canvas
	  gl.viewport(0, 0, canvas.width, canvas.height);
  
	  // Create and bind the position buffer
	  const positionBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	  // Define the positions of the rectangle covering the canvas
	  gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
		  -1.0, -1.0,  // Bottom-left corner
		   1.0, -1.0,  // Bottom-right corner
		  -1.0,  1.0,  // Top-left corner
		  -1.0,  1.0,  // Top-left corner
		   1.0, -1.0,  // Bottom-right corner
		   1.0,  1.0   // Top-right corner
		]),
		gl.STATIC_DRAW
	  );
  
	  // Retrieve shader source code from the HTML
	  const vertexShaderSource = document.getElementById('2d-vertex-shader').textContent;
	  const fragmentShaderSource = document.getElementById('2d-fragment-shader').textContent;
  
	  // Compile the shaders
	  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
	  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
  
	  // Create and link the shader program
	  program = createProgram(vertexShader, fragmentShader);
	  gl.useProgram(program);
  
	  // Get the location of the position attribute and enable it
	  const positionLocation = gl.getAttribLocation(program, 'a_position');
	  gl.enableVertexAttribArray(positionLocation);
	  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	  // Define how to read the position data from the buffer
	  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
	  // Get the locations of uniform variables in the shaders
	  getLocations();
	  // Set the initial values for the uniforms
	  setUniforms(image);
  
	  // Add event listeners for mouse movement and window resize
	  addEventListeners();
	  // Start the render loop
	  render();
	}
  
	/**
	 * Creates and compiles a shader.
	 * @param {number} type - The type of shader (vertex or fragment).
	 * @param {string} source - The GLSL source code for the shader.
	 * @returns {WebGLShader} - The compiled shader.
	 */
	function createShader(type, source) {
	  const shader = gl.createShader(type);
	  gl.shaderSource(shader, source);
	  gl.compileShader(shader);
  
	  // Check if the shader compiled successfully
	  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	  }
	  return shader;
	}
  
	/**
	 * Creates a shader program by linking vertex and fragment shaders.
	 * @param {WebGLShader} vertexShader - The compiled vertex shader.
	 * @param {WebGLShader} fragmentShader - The compiled fragment shader.
	 * @returns {WebGLProgram} - The linked shader program.
	 */
	function createProgram(vertexShader, fragmentShader) {
	  const prog = gl.createProgram();
	  gl.attachShader(prog, vertexShader);
	  gl.attachShader(prog, fragmentShader);
	  gl.linkProgram(prog);
  
	  // Check if the program linked successfully
	  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.error('Error linking program:', gl.getProgramInfoLog(prog));
		gl.deleteProgram(prog);
		return null;
	  }
	  return prog;
	}
  
	/**
	 * Retrieves the locations of uniform variables from the shader program.
	 */
	function getLocations() {
	  locationOfResolution = gl.getUniformLocation(program, 'u_resolution');
	  locationOfMouse = gl.getUniformLocation(program, 'u_mouse');
	  locationOfMass = gl.getUniformLocation(program, 'u_mass');
	  locationOfTime = gl.getUniformLocation(program, 'u_time');
	}
  
	/**
	 * Sets the uniform variables for the shaders.
	 * @param {HTMLImageElement} image - The image to be used as texture.
	 */
	function setUniforms(image) {
	  // Set the resolution uniform
	  gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	  // Set the mouse position uniform
	  gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	  // Set the mass uniform
	  gl.uniform1f(locationOfMass, curBlackholeMass * 0.00001);
	  // Set the time uniform
	  gl.uniform1f(locationOfTime, currentTime);
  
	  // Create and bind the texture coordinate buffer
	  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
	  const texCoordBuffer = gl.createBuffer();
	  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	  // Define the texture coordinates corresponding to the rectangle vertices
	  gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
		  0.0, 0.0,  // Bottom-left corner
		  1.0, 0.0,  // Bottom-right corner
		  0.0, 1.0,  // Top-left corner
		  0.0, 1.0,  // Top-left corner
		  1.0, 0.0,  // Bottom-right corner
		  1.0, 1.0   // Top-right corner
		]),
		gl.STATIC_DRAW
	  );
	  gl.enableVertexAttribArray(texCoordLocation);
	  // Define how to read the texture coordinate data from the buffer
	  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
  
	  // Create and bind the texture
	  const texture = gl.createTexture();
	  gl.bindTexture(gl.TEXTURE_2D, texture);
  
	  // Set texture parameters for wrapping and filtering
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
	  // Upload the image to the texture
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	}
  
	/**
	 * Adds event listeners for mouse movement and window resize.
	 */
	function addEventListeners() {
	  // Update mouse position on mouse move
	  canvas.addEventListener('mousemove', (e) => {
		const rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = canvas.height - (e.clientY - rect.top);
		mouse.moved = true;
	  });
  
	  // Adjust canvas size on window resize
	  window.addEventListener('resize', onResize);
	}
  
	/**
	 * Resizes the canvas to match the window dimensions.
	 */
	function resizeCanvas() {
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  // Update the viewport and resolution uniform
	  gl.viewport(0, 0, canvas.width, canvas.height);
	  gl.uniform2f(locationOfResolution, canvas.width, canvas.height);
	}
  
	/**
	 * Handler for window resize event.
	 */
	function onResize() {
	  resizeCanvas();
	}
  
	/**
	 * The render loop that updates and draws each frame.
	 */
	function render() {
	  // Calculate the elapsed time
	  currentTime = (Date.now() - startTime) / 1000;
  
	  // Smoothly increase the black hole mass to its maximum value
	  if (curBlackholeMass < blackholeMass - 50) {
		curBlackholeMass += (blackholeMass - curBlackholeMass) * 0.03;
	  }
  
	  // If the mouse hasn't moved, animate the mouse position
	  if (!mouse.moved) {
		mouse.y = (canvas.height / 2) + Math.sin(currentTime * 0.7) * (canvas.height * 0.25);
		mouse.x = (canvas.width / 2) + Math.sin(currentTime * 0.6) * (canvas.width * 0.35);
	  }
  
	  // Update uniforms with the current values
	  gl.uniform1f(locationOfMass, curBlackholeMass * 0.00001);
	  gl.uniform2f(locationOfMouse, mouse.x, mouse.y);
	  gl.uniform1f(locationOfTime, currentTime);
  
	  // Draw the rectangle (two triangles)
	  gl.drawArrays(gl.TRIANGLES, 0, 6);
	  // Request the next frame
	  requestAnimationFrame(render);
	}
  
	// Start the simulation once the window has loaded
	window.addEventListener('load', () => {
	  const image = new Image();
	  image.crossOrigin = 'Anonymous'; // Enable cross-origin image loading
	  image.src = bgUrl; // Set the source of the image
	  image.onload = () => init(image); // Initialize once the image has loaded
	});
  })();
  