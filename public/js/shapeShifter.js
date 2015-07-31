var shapeSettings = {
	Blanket: {
		AMOUNTX: 30,
		AMOUNTY: 30,
		separation: 150,
		zPos: 3000
	}
}

var buildParticles = function(xLength, yLength, SEPARATION) {
	var i = 0;
	particles = [];

	for (var ix = 0; ix < xLength; ix++) {
		for (var iy = 0; iy < yLength; iy++) {
			particle = particles[i++] = new THREE.Sprite(material);
			particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
			particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
			scene.add(particle);
		}
	}
}

var setCamera = function(x, y, z) {
	camera.position.x = x;
	camera.position.y = y;
	camera.position.z = z;
}

var reanimate = function(shape) {
	animate()
	buildParticles(shapeSettings[shape].AMOUNTX, shapeSettings[shape].AMOUNTY, shapeSettings[shape].separation)
	setCamera(0, 0, shapeSettings[shape].zPos)
}