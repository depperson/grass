var GameOver = function(game) {};

GameOver.prototype = {

    init: function() { this.score = game.state.states['Game'].totalScore; },
    
    screenClicked: function () { game.state.start("Game"); },
    
    create: function ()
    {
        centerX = window.innerWidth / 2;
        var titleStyle = { font: 'bold 40pt Courier', fill: '#EFEFEF', align: 'center'};
        var gameText = game.add.text(centerX, 200,  "GAME OVER\n\n" +
                                                    this.score + " POINTS\n\n" +
                                                    "PLAY AGAIN?", titleStyle);
        gameText.anchor.set(0.5, 0);
        gameText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        game.input.onDown.add(this.screenClicked, this);
    }
};