var express = require('express');
var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/../client/multi.html'));
});

app.use(express.static(path.join(__dirname, '/../client'))); //  "public" off of current is root

// Count how many are online
var clientSockets = {};

var player = require('./player.js');
var board = require('./room.js');

console.dir(player);

var currentRoom = board.create();

var addPlayer = function(player) {
	currentRoom.players[player.id] = player;
};

var users = io.of('/users').on('connection', function(socket){
	clientSockets[socket.id] = socket;

	var currentPlayer = player.create(socket.id);
	addPlayer(currentPlayer);

	board.emit('addPlayer', currentPlayer); 
	socket.emit('playerData', currentPlayer);

	board.emit('onlinePlayers', currentRoom.players.length);
	console.log('onlinePlayers:', currentRoom.players.length, currentRoom.players);

	// On Player Update, Change Board Data
	// Emit new board (maybe a interval?)

	socket.on('action', function(msg){
		console.log(msg);
	    board.emit('commands', msg, currentPlayer);
	});

	socket.on('disconnect', function(){
		// todo : remove player from game
		board.emit('removePlayer', currentPlayer);
		player.remove(currentPlayer);
	});
});

var board = io
	.of('/board')
	.on('connection', function (socket) {
    	console.log('Board connnected!');
	});

var port = process.env.PORT || 3000;

http.listen(port, function(){
	console.log('listening on *:' + port);
});