// Global Variables
var game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'game');
var Main = function () {};

Main.prototype = {

  preload: function () {
    //game.load.image('loading',  'assets/images/loading.png');
    game.load.script('splash',  'states/splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');
