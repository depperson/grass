var Game = function(game) {};
Game.prototype = {

    everySecond: function () { this.elapsedTime++; },
    
    
    create: function ()
    {
        game.physics.startSystem(Phaser.Physics.P2JS);
        
        // load the map
        map = game.add.tilemap('world');
        map.addTilesetImage('newtiles', 'tiles');
        tileLayer = map.createLayer(0);
        tileLayer.resizeWorld();
        //tileLayer.debug = true;

        // collide against dirt tiles
        map.setCollisionBetween(7, 10);
        map.setCollisionBetween(19, 22);
        game.physics.p2.convertTilemap(map, tileLayer);

        // make the grass
        grass = game.add.group();
        grassTileIds = [1, 2, 11, 12, 13, 14, 23, 24];
        for (var i = 0; i < 600; i++)
        {
            var rx = Math.random() * map.widthInPixels;
            var ry = Math.random() * map.heightInPixels;
            selectedTile = map.getTileWorldXY(rx, ry);
            if (selectedTile && grassTileIds.includes(selectedTile.index))
            {
                //console.log("tile " + selectedTile.index +
                //            " index " + grassTileIds.indexOf(selectedTile.index));
                var newgrass = grass.create(rx, ry, 'grass');
                game.physics.p2.enable(newgrass);
                newgrass.body.kinematic = true;
                //newgrass.body.mass = 0.1;
            }
        }
        
        // find the spawn point
        spawnTile = map.objects.Items[0];
        
        // spawn the player
        player = game.add.sprite(spawnTile.x, spawnTile.y, 'player');
        game.camera.follow(player);
        game.physics.p2.enable(player);
        player.body.setCircle(20, 0, -40);
        player.body.onBeginContact.add(this.playerHit, this);
        player.body.mass = 1;
        
        // TODO: fix alignment weirdness
        // player should collide with each map.objects.Bounds[] object;
        bounds = game.add.group();
        for (var i=0; i < map.objects.Bounds.length; i++)
        {
            thisBoundary = map.objects.Bounds[i];
            var newBoundary = bounds.create(thisBoundary.x, thisBoundary.y, null);
            //game.physics.p2.enable(newBoundary, true);
            game.physics.p2.enable(newBoundary);
            newBoundary.body.kinematic = true;
            
            // handle rectangle shapes
            if (thisBoundary.rectangle)
                newBoundary.body.setRectangle(thisBoundary.width, thisBoundary.height);
            
            // handle circles
            if (thisBoundary.ellipse)
                newBoundary.body.setCircle(thisBoundary.width / 2);
        }
        
        // (re)start the countdown timer
        this.elapsedTime = 1;
        this.totalScore = 100;
        game.time.events.loop(Phaser.Timer.SECOND, this.everySecond, this);
        
        // trigger the endgame after 60 seconds
        setTimeout(function () { game.state.start("GameOver", true, false, this.totalScore); }, 60000);
        
        // thanks https://github.com/Gamegur-us/phaser-touch-control-plugin
        this.touchControl = game.plugins.add(Phaser.Plugin.TouchControl);
        this.touchControl.inputEnable();
        
        // get keyboard input
        cursors = game.input.keyboard.createCursorKeys();
    },
    
    
    // gobble up the grass during a collision
    playerHit: function (body, bodyB, shapeA, shapeB, equation)
    {
        // remove the grass sprite
        if (body && body.sprite && body.sprite.key === "grass") body.sprite.kill();
        
        // score is inversely proportional to time
        var score = 100 / this.elapsedTime;
        this.totalScore += Math.round(score);
    },
    
    
    update: function ()
    {
        // keyboard
        if (cursors.left.isDown)        player.body.rotateLeft(100);
        else if (cursors.right.isDown)  player.body.rotateRight(100);
        else                            player.body.setZeroRotation();
        if (cursors.up.isDown)          player.body.thrust(400);
        else if (cursors.down.isDown)   player.body.reverse(400);
        //else                            player.body.setZeroVelocity();
        
        // touch
        var speed = this.touchControl.speed;
        player.body.thrust(speed.y);
        player.body.rotateLeft(speed.x);
        
        // cancel out the drifting / sliding feeling
        this.stopSidewaysVelocity(player);
        
        // speed limit
        this.constrainVelocity(player, 7);
    },
    
    
    // thanks valueerror http://tinyurl.com/zorcylm
    constrainVelocity: function (sprite, maxVelocity) {
        var body = sprite.body
        var angle, currVelocitySqr, vx, vy;
        
        vx = body.data.velocity[0];
        vy = body.data.velocity[1];
        
        currVelocitySqr = vx * vx + vy * vy;
        
        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);
            
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            
            body.data.velocity[0] = vx;
            body.data.velocity[1] = vy;
        }
    },
    
    
    // thanks https://gist.github.com/ShimShamSam/f10d60ad39040ed6add0
    stopSidewaysVelocity: function (sprite)
    {
        // Recycle the same object to conserve memory (what??)
        if(!this.stopSidewaysVelocity.sideways) {
            this.stopSidewaysVelocity.sideways = {};
        }
        
        var body     = sprite.body;
        var velocity = body.velocity;
        var rotation = body.rotation + Math.PI / 2;
        var sideways = this.stopSidewaysVelocity.sideways;
        
        sideways.x = Math.cos(rotation);
        sideways.y = Math.sin(rotation);
        
        var dot_product = velocity.x * sideways.x + velocity.y * sideways.y;
        
        velocity.x = sideways.x * dot_product;
        velocity.y = sideways.y * dot_product;
    },
    
    
    render: function ()
    {
        game.debug.text('grass.d33z.com v0.5', 10, 20);
        game.debug.text('score\t '+ this.totalScore +
                        '\ttime\t ' + (60 - this.elapsedTime), 10, 40);
        
        //game.debug.body(bounds);
    }
};
