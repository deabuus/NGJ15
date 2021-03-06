﻿// mods by Patrick OReilly 
// Twitter: @pato_reilly Web: http://patricko.byethost9.com
var game = new Phaser.Game(1280, 768, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.stage.disableVisibilityChange = true;
    game.load.image('ball', 'assets/LifeSocks/ball.png');
    game.load.image('pinkball', 'assets/LifeSocks/pinkball.png');
    game.load.image('borderShort', 'assets/LifeSocks/Border_short.jpg');
    game.load.image('borderLong', 'assets/LifeSocks/Border_long.jpg');
}

var image;
var balls;
var player;
var cursors;
var speed = 200;
var dangerZone;
var left, right;
var die;
var players = [];

function create() {
    game.stage.backgroundColor = '#c8c8c8';
    game.physics.startSystem(Phaser.Physics.ninja);

    balls = game.add.group();
    dangerZone = game.add.group();

    //game.physics.ninja.enable(balls);
    balls.enableBody = true;
    dangerZone.enableBody = true;

    var leftZone = dangerZone.create(0, 0, 'borderShort');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    leftZone.scale.setTo(4, 1);

    var rightZone = dangerZone.create(0, 0, 'borderLong');
    rightZone.rotate = 90;
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    rightZone.scale.setTo(1, 4);

    for (var i = 0; i < 20; i++) {
        balls.create(randomRange(1200, 10), randomRange(768, 10), 'ball');
    }


    // The player and its settings
    player = balls.create(randomRange(1200, 10), randomRange(768, 10), 'pinkball');
    player.anchor.setTo(0.5, 0.5);

    balls.setAll("body.velocity.x", 200);
    balls.setAll("body.velocity.y", 200);
    balls.setAll("body.bounce.y", 0.8);
    balls.setAll("body.bounce.x", 0.8);
    balls.setAll("body.collideWorldBounds", true);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.physics.arcade.collide(balls);
    game.physics.arcade.collide(player, balls);
    game.physics.arcade.overlap(balls, dangerZone, collision, null, this);

    //if (cursors.left.isDown) {
    if (left) {
        player.angle -= 10;
    }
    //else if (cursors.right.isDown) {
    if (right) {
        player.angle += 10;
    }

    left = false;
    right = false;
    game.physics.arcade.velocityFromRotation(player.rotation, speed, player.body.velocity);
}

function render() {

    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Properly centers game in windowed mode, but aligning
    // horizontally makes it off-centered in fullscreen mode.
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // Docs say this is necessary, but it doesn't seem to change behavior?
    game.scale.setScreenSize(true);

    // This is necessary to scale before waiting for window changes.
    game.scale.refresh();

    game.input.onDown.add(gofull, this);

}

function collision(ball) {
    ball.kill();
}

function gofull() {
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
    } else {
        game.scale.startFullScreen(false);
    }
}

function randomRange(max, min) {
    return Math.random() * (max - min) + min;
}

function randomIntRange(max, min) {
    return (min + Math.floor(Math.random() * (max - min + 1)));
}


// Viewport logic
var board = io.connect(document.location.origin + '/board');
board.on('commands', function (command, player) {
    console.log('Recive:', command);
    $('#log').append(JSON.stringify(command) + '- by ' + player.nickname + '<br />');

    if (command.moveLeft) {
        left = true;
    };

    if (command.moveRight) {
        right = true;
    };

    game.physics.arcade.velocityFromRotation(player.rotation, speed, player.body.velocity);
});
board.on('onlinePlayers', function (onlineNumber) {
    console.log(onlineNumber);
});

board.on('addPlayer', function (player) {
    console.log('Player joined:', player);
    //delete others[clientid];
    //removeRemoteClient(clientid);
});

board.on('removePlayer', function (clientid) {

    //delete others[clientid];

    //removeRemoteClient(clientid);
});