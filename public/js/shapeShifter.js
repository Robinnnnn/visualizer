function buildParticles(xLength, yLength) {
	var i = 0;
	particles = [];

	for (var ix = 0; ix < xLength; ix++) {
		for (var iy = 0; iy < yLength; iy++) {
			particle = particles[i++] = new THREE.Sprice(material);
			particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
			particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
			scene.add(particle);
		}
	}
}