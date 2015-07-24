var express = require('express');
var http = require('http');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
	var index = path.join(__dirname, 'canvas_particles_waves.html');
	res.sendFile(index);
});

var port = 3000;
app.listen(port, function() {
	console.log('The server is listening closely on port', port);
});