var SEPARATION = 100,
	AMOUNTX = 50,
	AMOUNTY = 50,
	AMOUNTZ = 10;

var colorSwitch = 1, // determines whether colors get brighter or darker
	rgbTracker = 0.75, // determines strength of color
	rgbCounter = 1;

var container;
var camera, scene, renderer, material;

var particles, particle, particle2, particles2, frameCount = 0;

var mouseX = 0,
	mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var settings;

var frameRate = 0.1;

init();
animate();

var SettingsController = function() {
	this.Speed = 5;
	this.Play = true;
	this.reactiveShapes = function() {};
	this.staticShapes = function() {};
};

initGUI();

// INTERFACE FOR FIDDLING
function initGUI() {
	settings = new SettingsController();
	var gui = new dat.GUI();
	gui.add(settings, 'Speed', 0, 10).onChange(function(value) {
		frameRate = value * 0.02;
	});
	gui.add(settings, 'Play').onChange(function(value){
		frameRate = value ? 0.1 : 0
	});
	gui.add(settings, 'reactiveShapes', ['Blanket', 'Cloth', 'Magic Carpet', 'Serpent', 'Swirl', 'Tsunami']).onChange(function(choice) {
		console.log(choice)
	});
	gui.add(settings, 'staticShapes', ['Particle Wave', 'Spiral Tower', 'Helix', 'Jellyfish', 'Galaxy', 'Matrix']).onChange(function(choice) {
			console.log(choice)
		})
		// // Play/pause
		// gui.add(effectController, "Play").onChange(function(value) {
		// 	// playing = value;
		// 	// if (playing) {
		// 	// 	requestAnimationFrame(animate);
		// 	// 	render();
		// 	// }
		// });

	// // User's choice
	// gui.add(effectController, 'Shape', ['Sphere', 'Hyperboloid', 'Snake']).onChange(function(value) {
	// 	// if (effectController.Shape === 'Sphere') {
	// 	// 	effectController.Min_Distance = 40; // this isn't working
	// 	// 	particleInitiator(setSphere, resetSphere);

	// 	// 	// reset line material
	// 	// 	group.remove(linesMesh)
	// 	// 	setMaterial(0x3cee06);

	// 	// } else if (effectController.Shape === 'Hyperboloid') {
	// 	// 	effectController.Min_Distance = 30; // this isn't working
	// 	// 	particleInitiator(setSphere, resetHyperboloid);

	// 	// 	group.remove(linesMesh)
	// 	// 	setMaterial(0xff4c4c);

	// 	// } else if (effectController.Shape === 'Snake') {
	// 	// 	effectController.Min_Distance = 30; // this isn't working
	// 	// 	particleInitiator(setSphere, resetSnake);

	// 	// 	group.remove(linesMesh)
	// 	// 	setMaterial(0x3cee06);
	// 	// }
}

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);

	// camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 3000;
	// camera.position.y = 500;
	// camera.position.x = 1000;
	controls = new THREE.OrbitControls(camera, container); // orbital controls

	scene = new THREE.Scene();

	particles = new Array();


	var PI2 = Math.PI * 2;
	material = new THREE.SpriteCanvasMaterial({

		color: 0xffffff, // dot color
		program: function(context) {

			context.beginPath();
			context.arc(0, 0, 0.5, 0, PI2, true);
			context.fill();

		}

	});

	var i = 0;

	for (var ix = 0; ix < AMOUNTX; ix++) {
		for (var iy = 0; iy < AMOUNTY; iy++) {

			particle = particles[i++] = new THREE.Sprite(material);
			particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
			particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
			scene.add(particle);

			// // Second Layer
			// particle2 = particles[i++] = new THREE.Sprite(material);
			// particle2.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
			// particle2.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
			// scene.add(particle2);

		}
	}


	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setBackgroundColor(0x000000); // background color
	container.appendChild(renderer.domElement);


	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);

	//

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

// mouse move functions
function onDocumentMouseMove(event) {

	// mouseX = event.clientX - windowHalfX;
	// mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

	// if (event.touches.length === 1) {

	// 	event.preventDefault();

	// 	mouseX = event.touches[0].pageX - windowHalfX;
	// 	mouseY = event.touches[0].pageY - windowHalfY;

	// }

}

function onDocumentTouchMove(event) {

	// if (event.touches.length === 1) {

	// 	event.preventDefault();

	// 	mouseX = event.touches[0].pageX - windowHalfX;
	// 	mouseY = event.touches[0].pageY - windowHalfY;

	// }

}



function animate() {
	requestAnimationFrame(animate);
	render();
}

function modulateColor(seconds) { // make this dependent on frame count instead of FPS?
	rgbTracker += colorSwitch * (0.25 / (seconds * 60))

	if (rgbTracker > 1) {
		rgbTracker = 1;
		colorSwitch *= -1
		rgbCounter += 1
	} else if (rgbTracker < 0.7) {
		rgbTracker = 0.7;
		colorSwitch *= -1
		rgbCounter += 1
	}

	// material.color.r = rgbTracker; // single color slider
}

function colorSlider(rgbCounter) {
	if (rgbCounter % 6 === 1) {
		material.color.g = 1.75 - rgbTracker;
	} else if (rgbCounter % 6 === 2) {
		material.color.r = 1.75 - rgbTracker;
	} else if (rgbCounter % 6 === 3) {
		material.color.b = 1.75 - rgbTracker;
	} else if (rgbCounter % 6 === 4) {
		material.color.g = 1.75 - rgbTracker;
	} else if (rgbCounter % 6 === 5) {
		material.color.r = 1.75 - rgbTracker;
	} else if (rgbCounter % 6 === 0) {
		material.color.b = 1.75 - rgbTracker;
	}
}

function incrementFrame() {
	frameCount += frameRate;
}

function render() {
	controls.update();

	// // mouse move FX
	// camera.position.x += (mouseX - camera.position.x) * .05;
	// camera.position.y += (-mouseY - camera.position.y) * .05;
	// camera.lookAt(scene.position);

	if (typeof array === 'object' && array.length > 0) {
		var i = 0;
		var k = 45;
		for (var ix = 0; ix < AMOUNTX; ix++) {
			for (var iy = 0; iy < AMOUNTY; iy++) {
				var frequencyStrength = (array[k] * 13);

				particle = particles[i++];

				/* REACTIVE */
				/* Particle Wave */
				// Background: Black or White
				// Particles: White or Black
				// AMOUNTX: 50
				// AMOUNTY: 50
				// Separation: 100
				// Camera position: 3000
				// Standard Wave
				particle.position.y =
					(Math.sin((ix + frameCount) * 0.5) * 75) +
					(Math.sin((iy + frameCount) * 0.5) * 75);
				// Varying Pulse
				particle.scale.x = particle.scale.y =
					(Math.sin((ix + frameCount) * 0.3) + 1) * 4 +
					(Math.sin((iy + frameCount) * 0.5) + 1) * 4;

				/* Matrix */
				// Background: Black or White
				// Particles: White or Black
				// AMOUNTX: 50
				// AMOUNTY: 50
				// Separation: 100
				// Camera position: 3000
				// particle.position.y =
				// 	(Math.tan((ix + frameCount) * 0.3) * 50) +
				// 	(Math.tan((iy + frameCount) * 0.5) * 50);
				// // Varying Pulse
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.3) + 1) * 4 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 4;

				/* Frequency Blanket [Large] */
				// Background: Black
				// Particles: White
				// AMOUNTX: 30
				// AMOUNTY: 15
				// Separation: 150
				// Camera position: 3000
				// k value: 5
				// analyser.smoothingTimeConstant = 0.95
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin(Math.sin((ix + frameCount)) * 0.3) + 1) * 10 +
				// 	(Math.sin(Math.sin(iy + frameCount) * 0.5) + 1) * 10;
				// particle.position.y = frequencyStrength - ((450 - i) * 0.8) - 600;

				/* Frequency Blanket[Small] */
				// Background: Black
				// Particles: White
				// AMOUNTX: 30
				// AMOUNTY: 15
				// Separation: 100
				// Camera position: 3000
				// k value: 8
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin(Math.sin((ix + frameCount)) * 0.5) + 1) * 10 +
				// 	(Math.sin(Math.sin(iy + frameCount) * 0.5) + 1) * 10;
				// particle.position.y = frequencyStrength - ((450 - i) * 1.5) - 1000;

				/* Magic Carpet */
				// Background: Black
				// Particles: Color (1.75)
				// AMOUNTX: 30
				// AMOUNTY: 15
				// Separation: 150
				// Camera.z: 3100
				// Camera.y: 500
				// k value: 14
				// analyser.smoothingTimeConstant = 0.97 or 96
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.5) + 1) * 10 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 10;
				// particle.position.y =
				// 	(Math.sin((ix + frameCount) * 0.1) * 300) +
				// 	(Math.sin((iy + frameCount) * 0.1) * 300) +
				// 	frequencyStrength - 1200 - ((450 - i) * 2);

				/* Serpent */
				// Background: Black
				// Particles: White / Colored
				// If colored make bright (1.7)
				// AMOUNTX: 75
				// AMOUNTY: 25
				// Separation: 150
				// // Camera.z: 4500
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.3) + 1) * 6 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 6;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount) * 0.3) * 700) +
				// 	(Math.sin((iy + frameCount) * 0.3) * 700);
				// particle.position.y = -2500 + (i * 4)
				// particle.position.y += frequencyStrength * 0.7

				/* Swirl */
				/* *** LOOK FROM TOP AND USE AS OPTICAL ILLUSION *** */
				// Background: Black
				// Particles: White / Colored
				// If colored make bright (1.7)
				// AMOUNTX: 75
				// AMOUNTY: 25
				// Separation: 150
				// Camera position: 4500
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.5) + 1) * 10 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 10;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount / 20) * 3) * 1000) +
				// 	(Math.sin((iy + frameCount / 20) * 3) * 1000)
				// particle.position.y = -4000 + (i * 6)
				// particle.position.y += frequencyStrength * 1

				/* Merry Go Round */
				// Background: Black
				// Particles: Color (1.75)
				// AMOUNTX: 30
				// AMOUNTY: 15
				// Separation: 200
				// Camera.z: 5000
				// Camera.y: 0
				// k value: 15
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.3) + 1) * 10 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 10;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount / 3) * 0.5) * 1000) +
				// 	(Math.sin((iy + frameCount / 3) * 0.5) * 1000);
				// particle.position.y = i * 8 - 3000 + frequencyStrength - ((450 - i) * 1.5)

				/* Tsunami */
				// Background: Black
				// Particles: Color (1.75)
				// AMOUNTX: 30
				// AMOUNTY: 15
				// Separation: 200
				// Camera.z: 3500
				// Camera.y: 0
				// k value: 15
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.3) + 1) * 8 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 8;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount / 3) * 0.1) * 1000) +
				// 	(Math.sin((iy + frameCount / 3) * 0.1) * 1000);
				// particle.position.y = i * 4 - 2000 + frequencyStrength - ((450 - i) * 1.5)

				/* STATIC */
				/* Spiral Tower */
				// Background: Black
				// Particles: White / Colored
				// If colored make bright (1.7)
				// AMOUNTX: 75
				// AMOUNTY: 25
				// Separation: 150
				// Camera position: 3000
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.3) + 1) * 4 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 4;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount) * 0.3) * 500) +
				// 	(Math.sin((iy + frameCount) * 0.3) * 500);
				// particle.position.y = -2500 + (i * 3)

				/* Helix */
				// Background: Black
				// Particles: White / Colored
				// If colored make bright (1.7)
				// AMOUNTX: 75
				// AMOUNTY: 25
				// Separation: 150
				// Camera position: 5000
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.5) + 1) * 7 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 7;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount / 20) * 3) * 700) +
				// 	(Math.sin((iy + frameCount / 20) * 3) * 700)
				// particle.position.y = -2500 + (i * 3)

				/* Radiating */
				// Background: Black
				// Particles: White / Colored
				// If colored make bright (1.7)
				// AMOUNTX: 75
				// AMOUNTY: 25
				// Separation: 150
				// Camera position: 5000
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.5) + 1) * 7 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 7;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount / 10) * 1) * 3000)
				// 	// (Math.sin((iy + frameCount / 20) * 3) * 700)
				// particle.position.y = -2500 + (i * 3)

				/* Galaxy */
				// Background: Black
				// Particles: White / Colored
				// If colored make bright (1.7)
				// AMOUNTX: 75
				// AMOUNTY: 25
				// Separation: 150
				// Camera position: 1000
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.5) + 1) * 7 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 7;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount / 1500) * 100) * 300) +
				// 	(Math.sin((iy + frameCount / 1500) * 1) * 300);
				// particle.position.y = -2500 + (i * 3)

				/* Jellyfish */
				// Background: Black
				// Particles: White / Colored
				// If colored make bright (1.7)
				// AMOUNTX: 75
				// AMOUNTY: 25
				// Separation: 150
				// Camera.z: 0
				// Camera.y: -4000
				// Camera.x: 1000
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.3) + 1) * 4 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 4;
				// // Undulating
				// particle.position.x =
				// 	(Math.sin((ix + frameCount) * 0.1) * 500) +
				// 	(Math.sin((iy + frameCount) * 0.1) * 500);
				// particle.position.y = -2500 + (i * 3)


				k += (k < array.length ? 1 : 0);
			}
		}
	}



	// var i = 0,
	// 	multiplierX = 1, // change multipliers to make weird shapes
	// 	multiplierY = 1;
	// for (var ix = 0; ix < AMOUNTX; ix++) {

	// 	for (var iy = 0; iy < AMOUNTY; iy++) {

	// 		particle = particles[i++];
	// 		/* SHAPE OF PARTICLE WAVE */
	// 		// cool multipliers: Math.sin(ix)
	// 		// Standard Wave
	// 		particle.position.y =
	// 			multiplierX * (Math.sin((ix + frameCount) * 0.3) * 50) +
	// 			multiplierY * (Math.sin((iy + frameCount) * 0.5) * 50);

	// 		// // Matrix
	// 		// particle.position.y =
	// 		// 	multiplierX * (Math.tan((ix + frameCount) * 0.3) * 50) +
	// 		// 	multiplierY * (Math.tan((iy + frameCount) * 0.5) * 50);

	// 		// // Second Layer
	// 		// particle2 = particles[i++];
	// 		// particle2.position.y = 100 +
	// 		// 	multiplierX * (Math.sin((ix + frameCount) * 0.3) * 50) +
	// 		// 	multiplierY * (Math.sin((iy + frameCount) * 0.5) * 50);

	// 		// // Undulating
	// 		// particle.position.x =
	// 		// 	multiplierX * (Math.sin((ix + frameCount) * 0.3) * 50) +
	// 		// 	multiplierY * (Math.sin((iy + frameCount) * 0.5) * 50);
	// 		// particle.position.y =
	// 		// 	Math.cos((ix + frameCount) * 0.3) * 50
	// 		// multiplierY * (Math.cos((iy + frameCount) * 0.5) * 50);

	// 		// // Terrain
	// 		// particle.position.y =
	// 		// 	Math.sin(ix) * multiplierX * (Math.cos((ix + frameCount) * 0.3) * 50) +
	// 		// 	Math.sin(ix) * multiplierY * (Math.cos((iy + frameCount) * 0.5) * 50);


	// 		/* PARTICLE SIZE */
	// 		// Still
	// 		// particle.scale.x = particle.scale.y = 10;
	// 		// particle2.scale.x = particle2.scale.y = 10; // second layer

	// 		// Varying Pulse
	// 		particle.scale.x = particle.scale.y =
	// 			(Math.sin((ix + frameCount) * 0.3) + 1) * 4 +
	// 			(Math.sin((iy + frameCount) * 0.5) + 1) * 4;

	// 		// // Standard Pulse
	// 		// particle.scale.x = particle.scale.y =
	// 		// 	(Math.sin(Math.sin((ix + frameCount)) * 0.3) + 1) * 4 +
	// 		// 	(Math.sin(Math.sin(iy + frameCount) * 0.5) + 1) * 4;

	// 		// // // Varying Size
	// 		// particle.scale.x = particle.scale.y =
	// 		// 	Math.sin(ix) * (Math.sin(Math.sin((ix + frameCount)) * 0.3) + 1) * 4 +
	// 		// 	(Math.sin(Math.sin(iy + frameCount) * 0.5) + 1) * 4;

	// 		// // Telegraph
	// 		// particle.scale.x = particle.scale.y = (Math.sin(Math.tan((ix + frameCount)) * 0.3) + 1) * 4 +
	// 		// 	(Math.sin(Math.tan((iy + frameCount)) * 0.5) + 1) * 4;
	// 	}
	// }

	// material.color.b = material.color.g = 1
	// material.color.r = 1.6 - rgbTracker;

	modulateColor(6);
	colorSlider(rgbCounter);

	renderer.render(scene, camera);
	frameCount += frameRate; // do something about resetting this to 0
	// incrementFrame();
}