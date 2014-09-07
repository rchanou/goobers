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
			currentPlayerId: null,
			game: {
				id: null,
				players: [
					{ id: null, coins: 0, pos: {x:null, y: null} }
				],
				playersToStart: null,
				level: {
					id: null,
					walls: [{x: null, y: null}],
					coins: [{x: null, y: null}],
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
		console.log(host);
	    this.socket = new WebSocket(host);
	    this.socket.onmessage = function(event){
     		console.log(JSON.parse(event.data));
	    };
		document.onkeydown = function(){

		};
	},
	checkGameReady: function(){
		return this.state.game.players.length >= playersToStart;
	},
	wallRects: function(){
		return this.state.game.level.walls.map(function(wall, i){
			return <rect key={'wall'+i} fill='grey'
				x={wall.x*this.k()} y={wall.y*this.k()}
				width={this.k()} height={this.k()} />;
		});
	},
	coinCircles: function(){
		return this.state.game.level.coins.map(function(coin, i){
			return <circle key ={'coin'+i} fill='yellow'
				cx={(coin.x+0.5)*this.k()} cy={(coin.y+0.5)*this.k()}
				r={this.k()/3} />;
		});
	},
	getMaxWall: function(axis){ // axis is 'x' or 'y'
		return Math.max.apply(null, _.pluck(this.state.game.level.walls, axis));
	},
	render: function(){
		if (this.state.currentPlayerId === null){
			return <div>Logging into server...</div>;
		}

		if (!this.checkGameReady()){

		}

		return <div>
			<svg width={this.getMaxWall('x')} height={this.getMaxWall('y')}>
				{this.wallRects()}
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