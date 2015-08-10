var setCameraAndScene = function(x, y, z) {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, windowDimensions, 1, 10000);
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
}

var createParticleMatter = function(color) {
	var PI2 = Math.PI * 2;
	material = new THREE.SpriteCanvasMaterial({
		color: color, // dot color
		program: function(context) {
			context.beginPath();
			context.arc(0, 0, 0.5, 0, PI2, true);
			context.fill();
		}
	});
}

var setRenderer = function(backgroundColor) {
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setBackgroundColor(backgroundColor);
	document.body.appendChild(renderer.domElement);
}

function onWindowResize() {
	camera.aspect = windowDimensions;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}