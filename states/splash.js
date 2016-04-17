var Splash = function () {};
Splash.prototype = {

    init: function ()
    {
        this.titleStyle = { font: 'bold 70pt Courier', fill: '#EFEFEF', align: 'center'};
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.loadingText = game.add.text(this.centerX, this.centerY, "LOAD'N", this.titleStyle);
        this.loadingText.anchor.set(0.5, 0);
    },
    

    preload: function ()
    {
        game.stage.backgroundColor = '#499855';
        
        game.load.script('game',    'states/game.js');
        game.load.script('gameover','states/gameover.js');
        game.load.script('joystick','vendor/phaser-touch-control.js');
        
        //game.load.tilemap('world', 'assets/grasstest.json', null, Phaser.Tilemap.TILED_JSON)
        //game.load.image('tiles', 'assets/tiles.png');
        
        game.load.tilemap('world', 'assets/newmap.json', null, Phaser.Tilemap.TILED_JSON)
        game.load.image('tiles', 'assets/newtiles.png');
        
        this.load.image('compass', 'assets/compass_rose.png');
        this.load.image('touch_segment', 'assets/touch_segment.png');
        this.load.image('touch', 'assets/touch.png');
        
        var mower = ['0000000000',
                     '..0....0..',
                     '0000000000',
                     '.30333303.',
                     '.30333303.',
                     '3303333033',
                     '3303333033',
                     '3303333033',
                     '.30333303.',
                     '.30333303.',
                     '..033330..',
                     '..0....0..',
                     '110....011',
                     '1100000011',
                     '11......11',
                     '11......11',
                     '..........',
                     '..........',
                     '..........',
                     '..........',
                     '..........',
                     '..........',
                     '..........',
                     '..........',
                     '..........',
                     '..........',
                     '..........'];
        game.create.texture('player', mower, 6, 6);
      
        var grass = ['.A', 'AA'];
        game.create.texture('grass', grass, 6, 6);
      
        /*
        var startTexture = ['111.111.111.111.111',
                            '1....1..1.1.1.1..1.',
                            '111..1..111.11...1.',
                            '..1..1..1.1.1.1..1.',
                            '111..1..1.1.1.1..1.'];
        game.create.texture('startTexture', startTexture, 6, 6);
        */
        game.physics.startSystem(Phaser.Physics.P2JS);
    },
    
    
    startClicked: function ()
    {
        startButton.visible = false;
        game.state.start("Game");
    },
    
    
    addGameStates: function ()
    {
        game.state.add("Game",Game);
        game.state.add("GameOver",GameOver);
    },


    create: function()
    {
        this.loadingText.visible = false;
        this.addGameStates();
        startButton = game.add.text(this.centerX, this.centerY, "PLAY", this.titleStyle);
        startButton.anchor.set(0.5, 0);
        
        game.input.onDown.add(this.startClicked, this);

        /* start the game automatically
        setTimeout(function () {
            game.state.start("Game");
        }, 1000); */
    }
};
