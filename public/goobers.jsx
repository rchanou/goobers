/** @jsx React.DOM */

var Goobers = React.createClass({
	getInitialState: function(){
		return {
			currentPlayerId: null,
			game: {
				id: null,
				players: [
					{ id: null, coins: 0, pos: {x:null, y: null} }
				],
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
	componentDidMount: function(){

	},
	render: function(){
		if (this.state.currentPlayerId === null){
			return <div>Logging into server...</div>;
		}



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