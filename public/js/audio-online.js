// https://github.com/srchea/Sound-Visualizer/blob/master/js/audio.js
var context;
var source, sourceJs;
var analyser;
var url = '/audio/MØ - Dont Wanna Dance (Phazz Remix).mp3';
var array = new Array();
var boost = 0;

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
			console.log('sourcsJs:', sourceJs);

			// analyser node
			analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 0.9;
			analyser.fftSize = 2048;
			console.log('analyser:', analyser);

			// audio buffer source node
			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			console.log(source)

			// connect all the nodes
			source.connect(analyser);
			analyser.connect(sourceJs);
			source.connect(context.destination); // final connection to the listener?
			source.start(0); // boot it up baby

			sourceJs.onaudioprocess = function(e) { // store and analyze frequency data
				array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				// boost = 0;
				// for (var i = 0; i < array.length; i++) {
				// 	boost += array[i];
				// }
				// boost = boost / array.length;
				// console.log(array, boost);
			};

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