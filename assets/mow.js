/**
 * Generated from the Phaser Sandbox
 *
 * http://phaser.io/sandbox/GFbzrkoX
 *
 * This source requires Phaser 2.4.4
 */

var player;
var grass;
var cursors;
var obstacle;
var startButton;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
                           { preload: preload, create: create, update: update, render: render });

function preload() {
    
    game.add.text(2, 580, 'grass.d33z.com v0.1', { font: "15px Arial", fill: "#19de65" });
    game.stage.backgroundColor = '#00cc66';
                
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
    
    var startTexture = ['.000000000000000000000.',
                        '0.....................0',
                        '0.111.111.111.111.111.0',
                        '0.1....1..1.1.1.1..1..0',
                        '0.111..1..111.11...1..0',
                        '0...1..1..1.1.1.1..1..0',
                        '0.111..1..1.1.1.1..1..0',
                        '0.....................0',
                        '.000000000000000000000.'];
    game.create.texture('startTexture', startTexture, 6, 6);
}


function create()
{
    
    // TODO: http://phaser.io/examples/v2/p2-physics/world-boundary
    
    game.physics.startSystem(Phaser.Physics.P2JS);
    //game.physics.p2.restitution = 0.9;

    grass = game.add.group();
    for (var i = 0; i < 100; i++)
    {
        var newgrass = grass.create(Math.random() * 800, Math.random() * 600, 'grass');
        game.physics.p2.enable(newgrass);
        newgrass.body.kinematic = true;
        newgrass.body.mass = 0.1;
    }
    
    player = game.add.sprite(100, 200, 'player');
    //player.anchor.setTo(0, 1);
    game.physics.p2.enable(player);
    player.body.setCircle(20, 0, -40);
    player.body.onBeginContact.add(playerHit, this);
    player.body.mass = 1;
    
    // TODO: map loader?
    
    startButton = game.add.button(game.world.centerX - 95, 300, 'startTexture', startClicked, this, 2, 1, 0);
    
    // get keyboard input
    cursors = game.input.keyboard.createCursorKeys();
    
}

function startClicked ()
{
    startButton.visible = false;
}


function playerHit (body, bodyB, shapeA, shapeB, equation)
{
    if (body != null && body.sprite.key === "grass")
    body.sprite.kill();
    // score = 1000 / seconds
}


function update ()
{

    if (cursors.left.isDown)
    {
        player.body.rotateLeft(100);
    }
    else if (cursors.right.isDown)
    {
        player.body.rotateRight(100);
    }
    else
    {
        player.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
        player.body.thrust(400);
    }
    else if (cursors.down.isDown)
    {
        player.body.reverse(400);
    }
    //else player.body.setZeroVelocity();

    stopSidewaysVelocity(player);

}


/**
 * Negate sideways velocity on an object being acted upon by a Phaser physics engine.
 * The primary use for this is to simulate vehicle movement by negating "drift" when the vehicle turns.
 * @param {Phaser.Sprite} sprite The sprite whose sideways velocity you want to negate
 */
function stopSidewaysVelocity(sprite) {
    // Recycle the same object to conserve memory
    if(!stopSidewaysVelocity.sideways) {
        stopSidewaysVelocity.sideways = {};
    }

    var body     = sprite.body;
    var velocity = body.velocity;
    var rotation = body.rotation + Math.PI / 2;
    var sideways = stopSidewaysVelocity.sideways;

    sideways.x = Math.cos(rotation);
    sideways.y = Math.sin(rotation);

    var dot_product = velocity.x * sideways.x + velocity.y * sideways.y;

    velocity.x = sideways.x * dot_product;
    velocity.y = sideways.y * dot_product;
}


function render () {
    game.debug.body(player, 32, 32);
    game.add.text(2, 0, '0,000,000', { font: "24px Arial", fill: "#FFFFFF" });
    game.add.text(680, 0, '00:00', { font: "15px Arial", fill: "#FFFFFF" });

}
