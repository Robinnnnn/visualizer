var colorSwitch = 1, // determines whether colors get brighter or darker
	rgbTracker = 0.75, // determines strength of color
	rgbCounter = 1;

var container;
var camera, scene, renderer, material;

var particles, particle, frameCount = 0;

var windowDimensions = window.innerWidth / window.innerHeight;
var settings;

var frameRate = 0.1;

var currentShape;

init();
animate();

var SettingsController = function() {
	this.Speed = 5;
	this.Play = true;
	this.Reactive = true;
	this.Static = true;
};


// INTERFACE FOR FIDDLING
function initGUI() {
	settings = new SettingsController();
	var gui = new dat.GUI();
	gui.add(settings, 'Speed', 0, 10).onChange(function(value) {
		frameRate = value * 0.02;
	});
	gui.add(settings, 'Play').onChange(function(value) {
		frameRate = value ? 0.1 : 0
	});
	gui.add(settings, 'Reactive', ['Pick One!', 'MagicCarpet', 'Circus', 'Pancakes', 'Serpent', 'Swirl']).onChange(function(choice) {
		if (choice !== 'Pick One!') {
			currentShape = choice;
			reanimate(currentShape);
		}
	})
	gui.add(settings, 'Static', ['MagicCarpet', 'Pancakes', 'Sphere', 'Jellyfish', 'Bow', 'Slinky', 'Matrix', 'Serpent', 'Swirl']).onChange(function(choice) {
		if (choice !== 'Pick One!') {
			currentShape = choice + 'Static';
			reanimate(currentShape);
		}
	})
}

initGUI();


// draws functions from initialize.js, 
// 						shapeShifter.js 
function init() {
	setCameraAndScene(0, 0, 3000);
	controls = new THREE.OrbitControls(camera);

	particles = new Array();
	createParticleMatter(0xffffff);

	currentShape = 'MagicCarpetStatic'
	buildShape(currentShape)

	setRenderer(0x000000); // also sets background color

	// responsiveness
	window.addEventListener('resize', onWindowResize, false);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function deanimate() {
	setCameraAndScene(shapeSettings[currentShape].position.x, shapeSettings[currentShape].position.y, shapeSettings[currentShape].position.z);
	controls = new THREE.OrbitControls(camera);
	particles = new Array();
	createParticleMatter(0xffffff);
	buildShape(currentShape);
}

function render() {
	controls.update();
	// just take an object instead of using so many variables

	visualizeParticles(currentShape, 'pulse', shapeSettings[currentShape].visualizer.size, shapeSettings[currentShape].visualizer.musicIsUsed, shapeSettings[currentShape].visualizer.calibrate, shapeSettings[currentShape].visualizer.strength, shapeSettings[currentShape].visualizer.reposition);

	material.color.b = 1
	material.color.g = 1
	material.color.r = 1.6 - rgbTracker;
	// modulateColor(2);
	// colorSlider(rgbCounter);
	renderer.render(scene, camera);
	frameCount += frameRate; // do something about resetting this to 0
}