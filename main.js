$(function () {
  var tweets = [];
  var hashtags = [];
//Get tweet data from server
  $.get('http://localhost:1337/gettweets', function (data) {
    tweets = JSON.parse(data);

    hashtags = tweets.reduce(function (hashtags, tweet) {
      for (var i in tweet.hashtags.hashtag_text) {
        hashtags.push(tweet.hashtags.hashtag_text[i]);
      }
      return hashtags
    }, []);
  });

  //artwork and img
  //PIXI.loader.add('avatar', 'images/survivor-idle_rifle_0.png');
  PIXI.loader.add('bunny', 'images/bunny.jpg');
  PIXI.loader.add('bullet', 'images/bullet.png');
  PIXI.loader.add('background', 'images/concrete_texture.jpg');
  PIXI.loader.add('explosion', 'images/explosion.json')
  PIXI.loader.add('hillary1', 'images/hillary1.png')
  PIXI.loader.add('hillary2', 'images/hillary2.png')
  PIXI.loader.add('hillary3', 'images/hillary3.png')
  PIXI.loader.add('trump1', 'images/trump1.png')


  //audio
  PIXI.loader.add([
        {name:"gunFiring", url:"/audio/gun-round.m4a"},
        {name:"enemyDown", url:"/audio/hillary-dead.m4a"}
        ]);


  PIXI.loader.load(function (loader, resources) {

    var explosionTextures = [];

    for (var i = 0; i < 26; i++) {
      var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i + 1) + '.png');
      explosionTextures.push(texture);
    }

    function addExplosion(position, scale) {
      var explosion = new PIXI.extras.MovieClip(explosionTextures);
      explosion.anchor.x = 0.5;
      explosion.anchor.y = 0.5;
      explosion.position.x = position.x;
      explosion.position.y = position.y;
      explosion.rotation = Math.random() * Math.PI;
      if (scale) {
        explosion.scale.x = scale;
        explosion.scale.y = scale;
      }
      explosion.play();
      stage.addChild(explosion);
      explosions.push(explosion);
    }

    // You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
    // which will try to choose the best renderer for the environment you are in.
    var renderer = new PIXI.WebGLRenderer(600, window.innerHeight);

    // The renderer will create a canvas element for you that you can then insert into the DOM.
    document.body.appendChild(renderer.view);


    // You need to create a root container that will hold the scene you want to draw.
    var stage = new PIXI.Container();

    var backgroundImg = new PIXI.extras.TilingSprite(resources.background.texture, 600, window.innerHeight);
    stage.addChild(backgroundImg);

    var $canvas = $(renderer.view);
    var canvasOffset = $canvas.offset();

    var cursorPosition = { x: 0, y: 0 };

    $canvas.on('mousemove', function (e) {
      cursorPosition.x = e.pageX - canvasOffset.left;
      cursorPosition.y = e.pageY - canvasOffset.top;
    });

    //Create Avatar
    function createAvatar(spriteTexture){
      var newAvatar =  new PIXI.Sprite(spriteTexture)
        newAvatar.position.x = 400;
        newAvatar.position.y = 300;
        var scale = 100 / newAvatar.width;
        newAvatar.scale.x = scale;
        newAvatar.scale.y = scale;
        newAvatar.anchor.x = 0.5;
        newAvatar.anchor.y = 0.5;
      //avatar.rotation = Math.PI;
      stage.addChild(newAvatar);
      return newAvatar;
    }
    var avatar, partContainer, isMouseDown, firingFrameCount;
    // One projectile every 10 frames
    var fireRate = 4;
    var obstacles, lastObstacle, obstacleRate, explosions, gameSpeed, gameSpeedAcceleration, bullets;
    var lastEnemy, enemies, enemyRate, gameOver;

    //scoring
    var score, scoreBoardBanner;

    function setLevel(level) {
      for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
      backgroundImg = new PIXI.extras.TilingSprite(resources.background.texture, 600, window.innerHeight);
      stage.addChild(backgroundImg);
    }
    //reset variables to default
    function setDefaults(){
      //remove children
      setLevel();

      $canvas = $(renderer.view);
      canvasOffset = $canvas.offset();

      cursorPosition = { x: 0, y: 0 };
      avatar = createAvatar(resources.trump1.texture);
      isMouseDown = false;
      firingFrameCount = 0;
      // One projectile every 10 frames
      fireRate = 4;
      partContainer = new PIXI.particles.ParticleContainer(10000, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
      });
      stage.addChild(partContainer);
      obstacles = [];
      lastObstacle = Date.now();
      obstacleRate = 3000;
      explosions = [];
      gameSpeed = 1;
      gameSpeedAcceleration = 0.004;
      bullets = [];
      lastEnemy = Date.now();
      enemies = [];
      enemyRate = 1500;
      gameOver = false;
      score = 1;
      scoreBoard = new PIXI.Text(score, {fontFamily : 'Arial', fontSize: 40, fill : 0xff1010, align : 'center'});
      scoreBoardBanner = new PIXI.Graphics();
      // scoreBoardBanner.drawRect(50, 250, 120, 120);
      // scoreBoardBanner.position.y = ;
      // scoreBoardBanner.position.x = 200;
      scoreBoard.anchor.x = 0.5;
      scoreBoard.position.x = 600/2;
      scoreBoard.position.y = window.innerHeight -50;
      stage.addChild(scoreBoard);
      // stage.addChild(scoreBoardBanner);
    };
    setDefaults();
    // kick off the animation loop (defined below)
    animate();

    function animate() {
      backgroundImg.tilePosition.y += gameSpeed;
      enemyRate = Math.max(500, enemyRate - gameSpeed / 10);
      gameSpeed += gameSpeedAcceleration;

      // start the timer for the next animation loop

      //requestAnimationFrame(animate);
      if (!gameOver){
        requestAnimationFrame(animate);
      }

      // Make the avatar follow the cursor
      avatar.position.x = cursorPosition.x;// - avatar.getBounds().width / 2 - 20;
      avatar.position.y = cursorPosition.y;// + avatar.getBounds().height / 2;

      if (isMouseDown) {
        if (firingFrameCount % fireRate == 0) {
          var bullet = new PIXI.Sprite(resources.bullet.texture);
          bullet.anchor.x = 0.5;
          bullet.anchor.y = 0.5;
          bullet.scale.x = 0.08;
          bullet.scale.y = 0.08;
          bullet.position.x = cursorPosition.x;
          bullet.position.y = cursorPosition.y;
          bullet.rotation = Math.PI / 2;
          partContainer.addChild(bullet);
          bullets.push(bullet);
          var gunFiring = PIXI.audioManager.getAudio('gunFiring');
          gunFiring.play();
        }
        firingFrameCount++;
      }

      score += gameSpeed;
      scoreBoard.text = score.toFixed(0);

      // Generate a new obstacle every so often
      if (Date.now() - lastObstacle > obstacleRate) {
        var obstacle = new PIXI.Text('#' + hashtags[Math.floor(Math.random() * hashtags.length)], {
          fontFamily: 'Black Ops One',
          fontSize: '36px',
          align: 'center'
        });
        var scale = 200 / obstacle.getBounds().width;
        obstacle.anchor.x = 0.5;
        obstacle.position.x = Math.random() * 400 + 100;;
        obstacle.position.y = -obstacle.getBounds().height;
        obstacle.scale.x = scale;
        obstacle.scale.y = scale;
        obstacle.hitsLeft = 3;
        stage.addChild(obstacle);
        obstacles.push(obstacle);
        lastObstacle = Date.now();
      }

      function createEnemy(spriteTexture){
        var enemy = new PIXI.Sprite(spriteTexture);
        enemy.horizontalVelocity = (Math.random() * 1 - 0.5);
        enemy.verticalVelocity = Math.min(gameSpeed / 10, 3) + Math.random() * 3;
        enemy.anchor.x = 0.5;
        enemy.position.y = -enemy.getBounds().height;
        enemy.position.x = Math.random() * 500 + 50;
        var scale = 100 / enemy.getBounds().width;
        enemy.scale.x = scale;
        enemy.scale.y = scale;
        stage.addChild(enemy);
        enemies.push(enemy);
      }
      if (Date.now() - lastEnemy > enemyRate) {
        var toSpawn = 3 + Math.random() * 3;
        if((Math.floor(Math.random()*3)+1) == 3) {
          var url = tweets[(Math.floor(Math.random()*tweets.length)+1)].user_profile_image_url
          //createEnemy();
          console.log(url);
        };
        for (var i = 0; i < toSpawn; i++) {

          createEnemy(resources['hillary' + (Math.floor(Math.random() * 3) + 1)].texture);
        }

        lastEnemy = Date.now();
      }

      for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];
        bullet.position.y -= 10;

        if (bullet.position.y < -bullet.getBounds().height) {
          partContainer.removeChild(bullet);
          bullets.splice(i, 1);
        }
      }

      for (var i = obstacles.length - 1; i >= 0; i--) {
        var obstacle = obstacles[i];
        obstacle.position.y += gameSpeed / 2;

        if (obstacle.position.y > window.innerHeight + obstacle.getBounds().height) {
          stage.removeChild(obstacle);
          obstacles.splice(i, 1);
        }

        if (isIntersecting(avatar.getBounds(), obstacle.getBounds())) {
          addExplosion(avatar.position);
        }
      }

      for (var i = obstacles.length - 1; i >= 0; i--) {
        var obstacle = obstacles[i];
        for (var j = bullets.length - 1; j >= 0; j--) {
          var bullet = bullets[j];

          if (isIntersecting(obstacle.getBounds(), bullet.getBounds())) {
            partContainer.removeChild(bullet);
            bullets.splice(j, 1);

            addExplosion(bullet.position, 0.25);

            if (obstacle.hitsLeft <= 0) {
              stage.removeChild(obstacle);
              obstacles.splice(i, 1);
              score += 300 * gameSpeed
              addExplosion(obstacle.position);
            }
            obstacle.hitsLeft--;
          }
        }
      }

      for (var i = explosions.length - 1; i >= 0; i--) {
        var explosion = explosions[i];

        if (explosion.currentFrame == explosion.totalFrames - 1) {
          stage.removeChild(explosion);
          explosions.splice(i, 1);
        }
      }


      for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        enemy.position.y += enemy.verticalVelocity;
        enemy.position.x += enemy.horizontalVelocity;
      }

      for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        if (enemy.position.y > window.innerHeight + enemy.getBounds().height) {
          stage.removeChild(enemy);
          enemies.splice(i, 1);
        }
      }

      for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];
        //console.log("length: " + enemies.length);
        for (var j = bullets.length - 1; j >= 0; j--) {
          var bullet = bullets[j];

          if (isIntersecting(bullet.getBounds(), enemy.getBounds())) {
            score += 100 * gameSpeed
            stage.removeChild(enemy);
            // var enemyDown = PIXI.audioManager.getAudio('enemyDown');
            // enemyDown.play();
            enemies.splice(i, 1);
            //console.log("enemy removed: " + enemies.length)
            partContainer.removeChild(bullet);
            bullets.splice(j, 1);

            addExplosion(enemy.position);
            break;
          }
        }

        if (isIntersecting(avatar.getBounds(), enemy.getBounds())) {
          gameOver = true;

          stage.removeChild(enemy);
          enemies.splice(i, 1);

          stage.removeChild(avatar);
          //Add text to tell user how to restart
          var resetText = new PIXI.Text("Click to play again", {fontFamily : 'Arial', fontSize: 40, fill : 0xff1010, align : 'center'});
          resetText.anchor.x = 0.5;
          resetText.position.x = 600/2;
          resetText.position.y = window.innerHeight/2;
          stage.addChild(resetText);
          addExplosion(avatar.position);
        }
      }

      // this is the main render call that makes pixi draw your container and its children.
      renderer.render(stage);
    }

    $canvas.on('mousedown', function () {
      firingFrameCount = 0;
      if(gameOver) { //On gameover reset game on mousedown
        setDefaults();
        animate();
      };
      isMouseDown = true;
    });
    $canvas.on('mouseup', function () {
      isMouseDown = false;
    });
  });

});
