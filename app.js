var GAME_TIME = 100;
var COUNTDOWN_TIME = 3;

var ws = require('ws');
var wsServer = ws.Server;
var http = require('http');
var express = require('express');
var app = express();
var _ = require('underscore');
app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('sup');
});

var wss = new wsServer({server: server});


// FUNCTIONS
var convertLevelMap = function(levelMap){
	var level = {
		walls: [],
		playerStarts: [],
		coins: []
	};
	
	levelMap.forEach(function(tileRow, y){
		for (var x = 0; x < tileRow.length; x++){
			switch (tileRow.charAt(x)){
				case 'x':
					level.walls.push({x: x, y: y});
					break;
				case '@':
					level.playerStarts.push({x: x, y: y});
					break;
			}		
		}
	});
	
	return level;
};


// STORE

var testLevelMap = [
	'xxxxxxxxxx',
	'x@      @x',
	'x        x',
	'x        x',
	'x        x',
	'x@      @x',
	'xxxxxxxxxx'
];

var goobers = new (function(){
	this.games = [];
	this.addGame = function(level){
		this.games.push({
			id: Math.random().toString(),
			players: [],
			level: convertLevelMap(testLevelMap),
			timeLeft: GAME_TIME,
			startCountdown: COUNTDOWN_TIME
		});
	}.bind(this);
	
	this.players = [];
	this.addPlayer = function(playerId){
		this.players.push({
			id: playerId,
			coins: 0,
			gamesPlayed: []
		});
	}.bind(this);
	
	this.addPlayerToGame = function(player){
		var latestGame = _.last(this.games);
	
		if (latestGame.players.length >= latestGame.level.playerStarts.length){
			this.addGame();
		}
		
		_.last(this.games).players.push({
			id: player.id,
			coins: 0
		});
	}.bind(this);
})();

goobers.addGame();

// WEBSOCKETS
wss.on('connection', function(socket){
	var playerId = Math.random().toString();
	
	goobers.addPlayer(playerId);
		
	socket.send(JSON.stringify(convertLevelMap(testLevelMap)));
	
	socket.on('close', function(e){
		console.log(e);
	});
});