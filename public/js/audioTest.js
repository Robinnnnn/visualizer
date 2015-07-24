var audioContext;
var playSoundBuffer;
var url = '/audio/holdTight.mp3';

function audioInit() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    loadNote();
}

function loadNote() {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
            playSoundBuffer = buffer;
            console.log(playSoundBuffer);
            playSound();
        }, function(error) {
            console.error("decodeAudioData error", error);
        });
    };
    request.send();
}

function playSound() {
    var source = audioContext.createBufferSource();
    source.buffer = playSoundBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

audioInit();