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
		id: Math.random(),
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
	this.addPlayer = function(){
		this.players.push({
			id: Math.random(),
			coins: 0,
			gamesPlayed: []
		});
		
		return _.last(this.players);
	}.bind(this);
	
	this.addPlayerToGame = function(player){
		var latestGame = _.last(this.games);
	
		if (latestGame.players.length >= latestGame.level.playerStarts.length){
			this.addGame();
		}
		
		_.last(this.games).players.push({
			id: player.id,
			coins: 0,
			pos: {x:3, y:3}
		});
		
		return _.last(this.games);
	}.bind(this);
})();

goobers.addGame();

// WEBSOCKETS

wss.updateClient = function(state){
	wss.send(JSON.stringify(state));
};

wss.on('connection', function(socket){
	var player = goobers.addPlayer();
	var currentGame = goobers.addPlayerToGame(player);
	
	var initialState = {
		player: player,
		game: currentGame
	}
	socket.send(JSON.stringify(initialState));
	
	socket.onmessage = function(event){
		var message = JSON.parse(event.data);
		switch (message.type){
			case 'request-move':
				console.log(message.payload);
				console.log(goobers.games);
				var game = _.findWhere(goobers.games, { id: message.payload.gameId });
				var player = _.findWhere(game.players, { id: message.payload.playerId });
				console.log(game);
				console.log(player);
				var nextPos = {
					x: player.pos.x,
					y: player.pos.y
				};
				nextPos[message.payload.axis] += parseInt(message.payload.dir);
				if (typeof _.findWhere(game.level.walls, nextPos) == 'undefined'){
					player.pos = nextPos;
				}
				break;
		}

		socket.send(JSON.stringify(initialState));
	};

	socket.on('close', function(e){
		console.log(e);
	});
}.bind(this));