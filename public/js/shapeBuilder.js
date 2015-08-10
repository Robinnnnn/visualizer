var shapeSettings = {
	'MagicCarpet': {
		AMOUNTX: 30,
		AMOUNTY: 15,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 3000
		},
		visualizer: {
			size: 10,
			musicIsUsed: true,
			calibrate: true,
			strength: 7,
			reposition: 0
		}
	},
	'Pancakes': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4000
		},
		visualizer: {
			size: 8,
			musicIsUsed: true,
			calibrate: false,
			strength: 7,
			reposition: -1000
		}
	},
	'Serpent': {
		AMOUNTX: 75,
		AMOUNTY: 25,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4500
		},
		visualizer: {
			size: 8,
			musicIsUsed: true,
			calibrate: false,
			strength: 7,
			reposition: 0
		}
	},
	'Swirl': {
		AMOUNTX: 75,
		AMOUNTY: 25,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4500
		},
		visualizer: {
			size: 8,
			musicIsUsed: true,
			calibrate: false,
			strength: 7,
			reposition: 0
		}
	},
	'Circus': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 1000,
			y: 1000,
			z: 4000
		},
		visualizer: {
			size: 10,
			musicIsUsed: true,
			calibrate: true,
			strength: 8,
			reposition: 0
		}
	},
	'MagicCarpetStatic': {
		AMOUNTX: 30,
		AMOUNTY: 15,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 3000
		},
		visualizer: {
			size: 10,
			musicIsUsed: false,
			calibrate: true,
			strength: 7,
			reposition: 0
		}
	},
	'PancakesStatic': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 0,
			y: 3000,
			z: 0
		},
		visualizer: {
			size: 5,
			musicIsUsed: false,
			calibrate: true,
			strength: 10,
			reposition: 0
		}
	},
	'SphereStatic': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 1000,
			y: 1000,
			z: 4000
		},
		visualizer: {
			size: 7,
			musicIsUsed: false,
			calibrate: true,
			strength: 10,
			reposition: 0
		}
	},
	'WaveStatic': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4000
		},
		visualizer: {
			size: 10,
			musicIsUsed: false
		}
	},
	'JellyfishStatic': {
		AMOUNTX: 75,
		AMOUNTY: 25,
		separation: 150,
		position: {
			x: 1000,
			y: -4000,
			z: 0
		},
		visualizer: {
			size: 10,
			musicIsUsed: false
		}
	},
	'BowStatic': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4000
		},
		visualizer: {
			size: 7,
			musicIsUsed: false
		}
	},
	'SlinkyStatic': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4000
		},
		visualizer: {
			size: 2,
			musicIsUsed: false
		}
	},
	'MatrixStatic': {
		AMOUNTX: 50,
		AMOUNTY: 50,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 5000
		},
		visualizer: {
			size: 5,
			musicIsUsed: false
		}
	},
	'SerpentStatic': {
		AMOUNTX: 75,
		AMOUNTY: 25,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4500
		},
		visualizer: {
			size: 8,
			musicIsUsed: false
		}
	},
	'SwirlStatic': {
		AMOUNTX: 75,
		AMOUNTY: 25,
		separation: 150,
		position: {
			x: 0,
			y: 0,
			z: 4500
		},
		visualizer: {
			size: 8,
			musicIsUsed: false
		}
	}
}

var buildParticles = function(xLength, yLength, separation) {
	var i = 0;

	for (var ix = 0; ix < xLength; ix++) {
		for (var iy = 0; iy < yLength; iy++) {
			particle = particles[i++] = new THREE.Sprite(material);
			particle.position.x = ix * separation - ((xLength * separation) / 2);
			particle.position.z = iy * separation - ((yLength * separation) / 2);
			scene.add(particle);
		}
	}
}

var buildShape = function(shape, type) {
	buildParticles(shapeSettings[shape].AMOUNTX, shapeSettings[shape].AMOUNTY, shapeSettings[shape].separation);
}

var sizeParticles = function(type, size, iterX, iterY) {
	if (type === 'static') {
		particle.scale.x = particle.scale.y = size * 3;
	} else if (type === 'pulse') {
		particle.scale.x = particle.scale.y =
			(Math.sin((iterX + frameCount) * 0.5) + 1) * size +
			(Math.sin((iterY + frameCount) * 0.5) + 1) * size;
	} else if (type === 'telegraph') {
		particle.scale.x = particle.scale.y = (Math.sin(Math.tan((iterX + frameCount)) * 0.3) + 1) * size +
			(Math.sin(Math.tan((iterY + frameCount)) * 0.5) + 1) * size;
	}
}

var positionParticles = function(name, iterX, iterY, reposition, particleIndex) {
	if (name === 'MagicCarpet') {
		particle.position.y =
			(Math.sin((iterX + frameCount) * 0.1) * 300) +
			(Math.sin((iterY + frameCount) * 0.1) * 300)
	} else if (name === 'Pancakes') {
		particle.position.x = Math.cos(Math.pow(iterX, 1.5) + frameCount / 15) * Math.cos(iterY + frameCount / 30) * 1500
		particle.position.z = Math.cos(Math.pow(iterX, 1.5) + frameCount / 15) * Math.sin(iterY + frameCount / 30) * 1500
		particle.position.y = Math.sin(iterX + frameCount / 30) * 1300 + reposition // refactor
	} else if (name === 'Serpent') {
		particle.position.x =
			(Math.sin((iterX + frameCount) * 0.3) * 800) +
			(Math.sin((iterY + frameCount) * 0.3) * 800);
		particle.position.y = -4000 + (particleIndex * 6)
	} else if (name === 'Swirl') {
		particle.position.x =
			(Math.sin((iterX + frameCount / 20) * 3) * 800) +
			(Math.sin((iterY + frameCount / 20) * 3) * 800)
		particle.position.y = -5000 + (particleIndex * 7)
	} else if (name === 'MagicCarpetStatic') {
		particle.position.y =
			(Math.sin((iterX + frameCount) * 0.1) * 300) +
			(Math.sin((iterY + frameCount) * 0.1) * 300)
	} else if (name === 'SphereStatic') {
		particle.position.x = Math.cos(iterX + frameCount / 30) * Math.cos((iterY + frameCount / 30)) * 1800
		particle.position.y = Math.cos(iterX + frameCount / 30) * Math.sin((iterY + frameCount / 30)) * 1800
		particle.position.z = Math.sin(iterX + frameCount / 30) * 1800
	} else if (name === 'PancakesStatic') {
		particle.position.x = Math.cos(Math.pow(iterX, 1.5) + frameCount / 30) * Math.cos(iterY + frameCount / 30) * 1200
		particle.position.z = Math.cos(Math.pow(iterX, 1.5) + frameCount / 30) * Math.sin(iterY + frameCount / 30) * 1200
		particle.position.y = Math.sin(iterX + frameCount / 30) * 1300 + reposition // refactor
	} else if (name === 'Circus') {
		// fix camera angle
		particle.position.z = Math.cos(iterX + frameCount / 30) * Math.cos((iterY + frameCount / 30)) * 1800
		particle.position.y = Math.cos(iterX + frameCount / 30) * Math.sin((iterY + frameCount / 30)) * 1800
		particle.position.x = Math.sin(iterX + frameCount / 30) * 5000
	} else if (name === 'BowStatic') {
		particle.position.x = Math.cos(iterX + frameCount / 30) * Math.cos((iterY + frameCount / 30)) * 1800
		particle.position.y = Math.cos(iterX + frameCount / 30) * Math.sin((iterY + frameCount / 30)) * 1800
		particle.position.z = Math.sin((iterY + frameCount / 30)) * 1800
	} else if (name === 'WaveStatic') {
		particle.position.y =
			(Math.sin((iterX + frameCount) * 0.5) * 75) +
			(Math.sin((iterY + frameCount) * 0.5) * 75);
	} else if (name === 'TerrainStatic') {
		particle.position.y =
			Math.sin(iterX) * (Math.cos((iterX + frameCount) * 0.5) * 75) +
			Math.sin(iterX) * (Math.cos((iterY + frameCount) * 0.5) * 75);
	} else if (name === 'MatrixStatic') {
		particle.position.y =
			(Math.tan((iterX + frameCount / 10) * 0.5) * 75) +
			(Math.tan((iterY + frameCount / 10) * 0.5) * 75);
	} else if (name === 'SlinkyStatic') {
		particle.position.x =
			(Math.sin((iterX + frameCount) * 0.125) * 50) * 3 +
			(Math.sin((iterY + frameCount) * 0.125) * 50) * 3;
		particle.position.y =
			(Math.cos((iterX + frameCount) * 0.125) * 50) * 3 +
			(Math.cos((iterY + frameCount) * 0.125) * 50) * 3;
	} else if (name === 'SerpentStatic') {
		particle.position.x =
			(Math.sin((iterX + frameCount) * 0.3) * 800) +
			(Math.sin((iterY + frameCount) * 0.3) * 800);
		particle.position.y = -5000 + (particleIndex * 4)
	} else if (name === 'SwirlStatic') {
		particle.position.x =
			(Math.sin((iterX + frameCount / 20) * 3) * 800) +
			(Math.sin((iterY + frameCount / 20) * 3) * 800)
		particle.position.y = -3000 + (particleIndex * 3.5)
	} else if (name === 'JellyfishStatic') {
		particle.position.x =
			(Math.sin((iterX + frameCount) * 0.1) * 500) +
			(Math.sin((iterY + frameCount) * 0.1) * 500);
		particle.position.y = -2500 + (particleIndex * 3);
	}
}

var applyMusic = function(particleIndex, frequencyIndex, calibrate, strength) {
	var frequencyStrength = lerpedFrequencies4[frequencyIndex] * strength;
	particle.position.y += frequencyStrength;
	if (calibrate) {
		particle.position.y -= 1000 + (450 - particleIndex) * 2;
	}
}

var visualizeParticles = function(shape, particleType, size, musicIsUsed, calibrate, strength, reposition) {
	if (typeof frequencies === 'object' && frequencies.length > 0) {
		var i = 0;
		var k = 45;

		for (var ix = 0; ix < shapeSettings[shape].AMOUNTX; ix++) {
			for (var iy = 0; iy < shapeSettings[shape].AMOUNTY; iy++) {
				particle = particles[i++];
				sizeParticles(particleType, size, ix, iy);
				positionParticles(shape, ix, iy, reposition, i);
				if (musicIsUsed) {
					applyMusic(i, k, calibrate, strength);
					if (k < lerpedFrequencies3.length) k++;
				}
			}
		}
	}
}