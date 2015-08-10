function modulateColor(seconds) { // make this dependent on frame count instead of FPS?
	rgbTracker += colorSwitch * (0.25 / (seconds * 60))

	if (rgbTracker > 1) {
		rgbTracker = 1;
		colorSwitch *= -1
		rgbCounter += 1
	} else if (rgbTracker < 0.75) {
		rgbTracker = 0.75;
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