var SEPARATION = 150,
	AMOUNTX = 30,
	AMOUNTY = 15,
	AMOUNTZ = 10;

var colorSwitch = 1, // determines whether colors get brighter or darker
	rgbTracker = 0, // determines strength of color
	rgbCounter = 0;

var container;
var camera, scene, renderer, material;

var particles, particle, particle2, particles2, frameCount = 0;

var mouseX = 0,
	mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 3000;

	scene = new THREE.Scene();

	particles = new Array();


	var PI2 = Math.PI * 2;
	material = new THREE.SpriteCanvasMaterial({

		color: 0x000000, // dot color
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

//

function onDocumentMouseMove(event) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {

	if (event.touches.length === 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;

	}

}

function onDocumentTouchMove(event) {

	if (event.touches.length === 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;

	}

}

//

function animate() {
	requestAnimationFrame(animate);
	render();
}

function modulateColor(seconds) { // make this dependent on frame count instead of FPS?
	rgbTracker += colorSwitch * (0.5 / (seconds * 60))

	if (rgbTracker > 1) {
		rgbTracker = 1;
		colorSwitch *= -1
		rgbCounter += 1
	} else if (rgbTracker < 0.5) {
		rgbTracker = 0.5;
		colorSwitch *= -1
		rgbCounter += 1
	}

	// material.color.r = rgbTracker; // single color slider
}

function colorSlider(rgbCounter) {
	if (rgbCounter % 6 === 1) {
		material.color.g = 1.5 - rgbTracker;
	} else if (rgbCounter % 6 === 2) {
		material.color.r = 1.5 - rgbTracker;
	} else if (rgbCounter % 6 === 3) {
		material.color.b = 1.5 - rgbTracker;
	} else if (rgbCounter % 6 === 4) {
		material.color.g = 1.5 - rgbTracker;
	} else if (rgbCounter % 6 === 5) {
		material.color.r = 1.5 - rgbTracker;
	} else if (rgbCounter % 6 === 0) {
		material.color.b = 1.5 - rgbTracker;
	}
}

function render() {

	camera.position.x += (mouseX - camera.position.x) * .05;
	camera.position.y += (-mouseY - camera.position.y) * .05;
	camera.lookAt(scene.position);

	if (typeof array === 'object' && array.length > 0) {
		var i = 0;

		var k = 0;
		for (var ix = 0; ix < AMOUNTX; ix++) {

			for (var iy = 0; iy < AMOUNTY; iy++) {

				var frequencyStrength = (array[k] * 5);

				particle = particles[i++];

				// particle.scale.x = particle.scale.y = 15; // size
				// // Varying Pulse
				// particle.scale.x = particle.scale.y =
				// 	(Math.sin((ix + frameCount) * 0.3) + 1) * 4 +
				// 	(Math.sin((iy + frameCount) * 0.5) + 1) * 4;

				// Standard Pulse
				particle.scale.x = particle.scale.y =
					(Math.sin(Math.sin((ix + frameCount)) * 0.3) + 1) * 12 +
					(Math.sin(Math.sin(iy + frameCount) * 0.5) + 1) * 12;

				// // Undulating
				// particle.position.x = frequencyStrength -
				// 	(Math.sin((ix + frameCount) * 0.3) * 200) +
				// 	(Math.sin((iy + frameCount) * 0.5) * 200);
				// particle.position.y = scale -
				// 	Math.cos((ix + frameCount) * 0.3) * 200 + (Math.cos((iy + frameCount) * 0.5) * 200);

				particle.position.y = frequencyStrength - ((450 - i) * 0.8) - 600;

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

	// material.color.r = material.color.g = material.color.b = 0

	modulateColor(2);
	colorSlider(rgbCounter);

	renderer.render(scene, camera);

	frameCount += 0.1; // do something about resetting this to 0
}