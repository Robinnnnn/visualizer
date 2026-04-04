// https://github.com/srchea/Sound-Visualizer/blob/master/js/audio.js
var context;
var source, sourceJs;
var analyser;
// var url = '/audio/MØ - Dont Wanna Dance (Phazz Remix).mp3';
// var url = '/audio/Body Gold (Louis The Child Remix).mp3';
// var url = '/audio/2015-08-09_22h56m57.wav';
var url = 'https://dl.dropbox.com/s/bxfdcacy6w9bjug/phazz.mp3';
var frequencies = new Array();
var lerpedFrequencies = new Array();
var lerpedFrequencies2 = new Array();
var lerpedFrequencies3 = new Array();
var lerpedFrequencies4 = new Array();
var lerpedFrequencies5 = new Array();
var frequenciesNew = [];
var totalFrequencies;
var frequenciesPrev;
var averageDeltas = [];
var averageAmp;
var decodedBuffer;
var started = false;
var statusEl = document.getElementById('status');
var playOverlayEl = document.getElementById('playOverlay');
var playButtonEl = document.getElementById('playButton');

function setStatus(message) {
	if (statusEl) {
		statusEl.textContent = message || '';
	}
}

try {
	context = new (window.AudioContext || window.webkitAudioContext)();
} catch (e) {
	setStatus('Web Audio API is not supported in this browser.');
}

if (!context) {
	throw new Error('AudioContext is unavailable.');
}

var request = new XMLHttpRequest();
request.open('GET', url, true);
request.responseType = 'arraybuffer';

function connectAudioGraph(buffer) {
	sourceJs = context.createScriptProcessor(2048, 1, 1);
	sourceJs.buffer = buffer;
	sourceJs.connect(context.destination);

	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.96;
	analyser.fftSize = 2048;

	source = context.createBufferSource();
	source.buffer = buffer;
	source.loop = true;

	source.connect(analyser);
	analyser.connect(sourceJs);
	source.connect(context.destination);

	Uint8Array.prototype.slice = Array.prototype.slice;
	Uint8Array.prototype.forEach = Array.prototype.forEach;

	sourceJs.onaudioprocess = function() {
		frequencies = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(frequencies);

		totalFrequencies = frequencies.length;
		getAverageVolume(frequencies);

		for (var i = 0; i < frequencies.length; i++) {
			frequenciesNew[i] = frequencies[i] * 2;
		}

		if (lerpedFrequencies3.length) {
			lerp(lerpedFrequencies3, lerpedFrequencies, lerpedFrequencies4, 0.1);
		}

		if (lerpedFrequencies2.length) {
			lerp(lerpedFrequencies2, lerpedFrequencies, lerpedFrequencies3, 0.1);
		}

		if (lerpedFrequencies.length) {
			lerp(lerpedFrequencies, frequencies, lerpedFrequencies2, 0.1);
		}

		if (frequenciesPrev) {
			lerp(frequenciesNew, frequenciesPrev, lerpedFrequencies, 0.1);
		}

		if (frequenciesNew) {
			frequenciesPrev = frequenciesNew.slice();
		}
	};
}

request.onload = function() {
	setStatus('decoding track…');

	context.decodeAudioData(
		request.response,
		function(buffer) {
			if (!buffer) {
				setStatus('Error decoding file data.');
				return;
			}

			decodedBuffer = buffer;
			connectAudioGraph(buffer);
			setStatus('ready — click the button to start audio.');
			if (playButtonEl) {
				playButtonEl.disabled = false;
			}
		},
		function(error) {
			setStatus('Decoding error: ' + error);
		}
	);
};

request.send();

request.onerror = function() {
	setStatus('Could not load the source MP3.');
};

function lerp(oldFreq, currentFreq, lerpedFreq, alpha) {
	for (var i = 0; i < totalFrequencies; i++) {
		lerpedFreq[i] = oldFreq[i] + (currentFreq[i] - oldFreq[i]) * alpha;
	}
}

function getDelta(currentFreq, oldFreq) {
	var deltaSum = 0;

	for (var i = 0; i < totalFrequencies; i++) {
		deltaSum += lerpedFrequencies[i] - frequenciesPrev[i];
	}
	averageDelta = deltaSum / totalFrequencies;
	if (!isNaN(averageDelta)) averageDeltas.push(averageDelta);
}

function getAverageVolume(frequencies) {
	var amplitudeSum = 0;

	for (var i = 0; i < totalFrequencies; i++) {
		amplitudeSum += frequencies[i];
	}

	averageAmp = amplitudeSum / totalFrequencies;
}

function displayTime(time) {
	if (time < 60) {
		return '0:' + (time < 10 ? '0' + time : time);
	} else {
		var minutes = Math.floor(time / 60);
		time -= minutes * 60;
		return minutes + ':' + (time < 10 ? '0' + time : time);
	}
}

function play() {
	if (started || !decodedBuffer || !source) {
		return;
	}

	var resumePromise = context.state === 'suspended' ? context.resume() : Promise.resolve();

	resumePromise.then(function() {
		started = true;
		source.start(0);
		if (playOverlayEl) {
			playOverlayEl.style.display = 'none';
		}
		setStatus('');
	}).catch(function(error) {
		started = false;
		setStatus('Could not start playback: ' + error);
	});
}

if (playButtonEl) {
	playButtonEl.disabled = true;
	playButtonEl.addEventListener('click', play);
}

setStatus('loading track…');
