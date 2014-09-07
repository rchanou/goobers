var ws = require('ws');
var wsServer = ws.Server;
var http = require('http');
var express = require('express');
var app = express();
app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('sup');
});

var wss = new wsServer({server: server});

wss.on('connection', function(socket){
	var id = setInterval(function(){
		socket.send(JSON.stringify(new Date()));
	}, 1000);
	
	socket.on('close', function(){
		clearInterval(id);
	});
});