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

// loading screen
var interval = window.setInterval(function() {
	if ($('#loading_dots').text().length < 3) {
		$('#loading_dots').text($('#loading_dots').text() + '.');
	} else {
		$('#loading_dots').text('');
	}
}, 500);

// make sure web audio API is supported
try {
	context = new AudioContext();
} catch (e) {
	$('#info').text('Web Audio API is not supported in this browser');
}

// load the audio file with an XMLHttpRequest...
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";
// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createBufferSource
var source = context.createBufferSource();



// ...and an asynchronous callback
request.onload = function() {
	context.decodeAudioData(
		request.response,
		function(buffer) {
			if (!buffer) {
				$('#info').text('Error decoding file data');
				return;
			}

			// processor node
			sourceJs = context.createScriptProcessor(2048, 1, 1);
			sourceJs.buffer = buffer;
			sourceJs.connect(context.destination);

			// analyser node
			analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 0.96;
			analyser.fftSize = 2048;

			// audio buffer source node
			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;

			// connect all the nodes
			source.connect(analyser);
			analyser.connect(sourceJs);
			source.connect(context.destination); // final connection to the listener?

			/* BOOT IT UP */
			source.start(0);

			Uint8Array.prototype.slice = Array.prototype.slice;
			Uint8Array.prototype.forEach = Array.prototype.forEach;

			sourceJs.onaudioprocess = function(e) { // store and analyze frequency data
				frequencies = new Uint8Array(analyser.frequencyBinCount)

				analyser.getByteFrequencyData(frequencies);

				totalFrequencies = frequencies.length;
				getAverageVolume(frequencies);

				for (var i = 0; i < frequencies.length; i++) {
					frequenciesNew[i] = frequencies[i] * 2;
				}

				// if (lerpedFrequencies4.length) {
				// 	lerp(lerpedFrequencies4, lerpedFrequencies, lerpedFrequencies5, 0.1);
				// }

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

			// apply linear interpolation
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
				if (!isNaN(averageDelta)) averageDeltas.push(averageDelta)
			}

			// calculate average of all frequency amplitudes
			function getAverageVolume(frequencies) {
				var amplitudeSum = 0;

				for (var i = 0; i < totalFrequencies; i++) {
					amplitudeSum += frequencies[i];
				}

				averageAmp = amplitudeSum / totalFrequencies;
			}

			clearInterval(interval);

			// popup
			$('body').append($('<div onclick="play();" id="play" style="width: ' + $(window).width() + 'px; height: ' + $(window).height() + 'px;"><div id="play_link"></div></div>'));
			$('#play_link').css('top', ($(window).height() / 2 - $('#play_link').height() / 2) + 'px');
			$('#play_link').css('left', ($(window).width() / 2 - $('#play_link').width() / 2) + 'px');
			$('#play').fadeIn();
		},
		function(error) {
			$('#info').text('Decoding error:' + error);
		}
	);
};

request.send();


request.onerror = function() {
	$('#info').text('buffer: XHR error');
};

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
	$('#play').fadeOut('normal', function() {
		$(this).remove();
	});
	source.start(0);
}