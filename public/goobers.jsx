/** @jsx React.DOM */

var Goobers = React.createClass({
	socket: null,
	getDefaultProps: function(){
		return {
			scale: 40
		};
	},
	k: function(){
		return this.props.scale;
	},
	getInitialState: function(){
		return {
			player: {
				id: null,
				coins: 0,
				gamesPlayed: []
			},
			game: {
				id: null,
				players: [
					{ id: null, coins: 0, pos: {x:null, y: null} }
				],
				level: {
					id: null,
					walls: [{x: null, y: null}],
					coins: [{x: null, y: null}],
					playerStarts: [{x: null, y: null}]
				},
				startCountdown: null,
				timeLeft: null
			}
		};
	},
	login: function(){

	},
	componentDidMount: function(){
	    var host = location.origin.replace(/^http/, 'ws');
	    this.socket = new WebSocket(host);
	    this.socket.onmessage = function(event){
	    	var newState = JSON.parse(event.data);
	    	this.setState(newState);
	    	console.log(event.data);
	    	/*var newState;
	    	switch (message.type){
	    		case 'level':
	    			console.log(message.payload);
	    			newState = React.addons.update(this.state, {
	    				game: {
	    					level: {$merge: message.payload}
	    				}
	    			});
	    			console.log(newState);
	    			break;
	    	}

	    	this.setState(newState);*/
	    }.bind(this);
		document.onkeydown = function(){

		};
	},
	checkGameReady: function(){
		return this.state.game.players.length >= this.state.game.level.playerStarts.length;
	},
	wallRects: function(){
		return this.state.game.level.walls.map(function(wall, i){
			return <rect key={'wall'+i} fill='grey'
				x={wall.x*this.k()} y={wall.y*this.k()}
				width={this.k()} height={this.k()} />;
		}.bind(this));
	},
	coinCircles: function(){
		return this.state.game.level.coins.map(function(coin, i){
			return <circle key ={'coin'+i} fill='yellow'
				cx={(coin.x+0.5)*this.k()} cy={(coin.y+0.5)*this.k()}
				r={this.k()/3} />;
		}.bind(this));
	},
	playerSprites: function(){
		//var player = _.findWhere(this.state.game.players, { id: this.state.player.id });
		return this.state.game.players.map(function(player, i){
			return <circle key={'player'+i} fill={'hsl(' + i*90 + ',50%,50%)'}
				cx={(player.pos.x+0.5)*this.k()} cy={(player.pos.y+0.5)*this.k()}
				r={this.k()/2} />
		}.bind(this));
	},
	getMaxWall: function(axis){ // axis is 'x' or 'y'
		return (Math.max.apply(null, _.pluck(this.state.game.level.walls, axis))+1)*this.props.scale;
	},
	render: function(){
		if (this.state.player.id === null){
			return <div>Logging into server...</div>;
		}

		if (!this.checkGameReady()){

		}

		return <div>
			<svg width={this.getMaxWall('x')} height={this.getMaxWall('y')}>
				{this.wallRects()}{this.playerSprites()}
			</svg>
		</div>;
		//return <Game />;
	}
});

var Game = React.createClass({
	render: function(){
		
	}
});

var Level = React.createClass({
	render: function(){
		
	}
});

var Player = React.createClass({
	render: function(){
		
	}
});

React.renderComponent(<Goobers />, document.getElementById('goobers'));