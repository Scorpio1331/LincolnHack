$(function () {
  $("html").css("cursor","none");
  $("body").css("cursor","none");
  var tweets = [];
  var hashtags = [];
//Get tweet data from server
  var url = "";
  if(hero == "trump"){
    url = "gethtweets";
  } else{
    url = "getdtweets";
  }
  $.get('http://localhost:1337/'+url, function (data) {
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
  PIXI.loader.add('background', 'images/seamless_wood_floor.jpg');
  PIXI.loader.add('bossBackground', 'images/whitehouse.jpg');
  PIXI.loader.add('explosion', 'images/explosion.json')
  PIXI.loader.add('hillary1', 'images/hillary1.png')
  PIXI.loader.add('hillary2', 'images/hillary2.png')
  PIXI.loader.add('hillary3', 'images/hillary3.png')
  PIXI.loader.add('hillary4', 'images/hillary4.png')
  PIXI.loader.add('trump1', 'images/trump1.png')
  PIXI.loader.add('extraBullet', 'images/ourLord.png')
  PIXI.loader.add('shield', 'images/illuminati.png')
  PIXI.loader.add('obama', 'images/obamalaughingface.png')
  PIXI.loader.add('trump2', 'images/trump2.png')
  PIXI.loader.add('trump3', 'images/trump3.png')
  PIXI.loader.add('trump4', 'images/trump4.png')
  PIXI.loader.add('trump5', 'images/trump5.png')
  PIXI.loader.add('trump6', 'images/trump6.png')


  //audio
  PIXI.loader.add([
        {name:"gunFiring", url:"/audio/gun-round.m4a"},
        {name:"enemyDown", url:"/audio/hillary-dead.m4a"},
        {name:"powerUp", url:"/audio/meat.m4a"},
        {name:"endGame", url:"/audio/endGame.m4a"}
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
    var fireRate = 16;
    var obstacles, lastObstacle, obstacleRate, explosions, gameSpeed, gameSpeedAcceleration, bullets;
    var lastEnemy, enemies, enemyRate,boss, bossActivated,bossScore, gameOver;
    var powerUps, powerLevel, shield, powerUpWeighting;
    var endGame;


    //scoring
    var score,scoreBoard, scoreBoardBanner;


    function setLevel(backgroundTexture) {
      for (var i = stage.children.length - 1; i >= 0; i--) {	stage.removeChild(stage.children[i]);};
      backgroundImg = new PIXI.extras.TilingSprite(backgroundTexture, 600, window.innerHeight);

      stage.addChild(backgroundImg);

      stage.addChild(partContainer);
      if(hero == "trump"){
        avatar = createAvatar(resources.trump1.texture);
      } else {
        avatar = createAvatar(resources.hillary4.texture);
      }
      stage.addChild(scoreBoard);
    }
    //reset variables to default
    function setDefaults(){
      //remove children


      $canvas = $(renderer.view);
      canvasOffset = $canvas.offset();

      cursorPosition = { x: 0, y: 0 };
      avatar = createAvatar(resources.trump1.texture);
      isMouseDown = false;
      firingFrameCount = 0;
      // One projectile every 10 frames
      fireRate = 16;
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
      powerUps = [];
      gameSpeed = 1;
      gameSpeedAcceleration = 0.004;
      bullets = [];
      lastEnemy = Date.now();
      enemies = [];
      enemyRate = 3000;
      powerLevel = 0;
      powerUpWeighting = 0;
      shield = 0;
      gameOver = false;
      bossActivated = 0;
      bossScore = 1500000;
      endGame = PIXI.audioManager.getAudio('endGame');
      score = 0;
      scoreBoard = new PIXI.Text(score, {fontFamily : 'Arial', fontSize: 40, fill : 0xff1010, align : 'center'});
      scoreBoardBanner = new PIXI.Graphics();
      // scoreBoardBanner.drawRect(50, 250, 120, 120);
      // scoreBoardBanner.position.y = ;
      // scoreBoardBanner.position.x = 200;
      scoreBoard.anchor.x = 0.5;
      scoreBoard.position.x = 600/2;
      scoreBoard.position.y = window.innerHeight -50;
      // stage.addChild(scoreBoardBanner);
      setLevel(resources.background.texture);
    };
    setDefaults();
    // kick off the animation loop (defined below)
    animate();

    function createBullet(position, rotation) {
      var bullet = new PIXI.Sprite(resources.bullet.texture);
      bullet.anchor.x = 0.5;
      bullet.anchor.y = 0.5;
      bullet.scale.x = 0.08;
      bullet.scale.y = 0.08;
      bullet.position.x = position.x;
      bullet.position.y = position.y;
      bullet.rotation = rotation || Math.PI / 2;
      partContainer.addChild(bullet);
      bullets.push(bullet);
      return bullet;
    }

    function animate() {
      if(bossActivated != 1) {
      backgroundImg.tilePosition.y += gameSpeed;
      }
      enemyRate = Math.max(500, enemyRate - gameSpeed / 10);
      gameSpeed += gameSpeedAcceleration;

      // start the timer for the next animation loop

      //requestAnimationFrame(animate);
      if (!gameOver){
        requestAnimationFrame(animate);
      }
      //If score reaches 1,500,000 activate boss fight
      if (score > bossScore && bossActivated == 0){
        enemies = [];
        obstacles = [];
        powerUps = [];
        setLevel(resources.bossBackground.texture);
        boss = new PIXI.Sprite(resources.obama.texture);
        boss.horizontalVelocity = 0;
        boss.verticalVelocity =  0.3;
        boss.anchor.x = 0.5;
        boss.position.y = -boss.getBounds().height * 3;
        boss.position.x = boss.getBounds().width*2.5;
        var scale = 300/ boss.getBounds().width;
        boss.scale.x = scale;
        boss.scale.y = scale;
        boss.hitsLeft = fireRate *111;
        stage.addChild(boss)
        bossActivated = 1;
      }
      if (bossActivated ==1) {
        boss.position.y += boss.verticalVelocity;
        if ( (boss.position.y > window.innerHeight ) || (isIntersecting(avatar.getBounds(), boss.getBounds()))) {
          addExplosion(avatar.position);
          loseGame();
        }
        for (var j = bullets.length - 1; j >= 0; j--) {
          var bullet = bullets[j];

          if (isIntersecting(boss.getBounds(), bullet.getBounds())) {
            partContainer.removeChild(bullet);
            bullets.splice(j, 1);

            addExplosion(bullet.position, 0.25);
            boss.hitsLeft--;

            if (boss.hitsLeft <= 0) {
              stage.removeChild(boss);
              score += 300000 * gameSpeed
              addExplosion(boss.position);
              boss = null;
              bossActivated = 2;
              bossScore *= 3.66;
            }

          }
        }
      }
      // Make the avatar follow the cursor
      avatar.position.x = cursorPosition.x;// - avatar.getBounds().width / 2 - 20;
      avatar.position.y = cursorPosition.y;// + avatar.getBounds().height / 2;

      if (isMouseDown) {
        var adjustedFireRate = powerLevel > 4
          ? (fireRate - powerLevel) * 2
          : (fireRate - powerLevel);

        if (firingFrameCount % Math.max(adjustedFireRate, 5) == 0) {
          createBullet(cursorPosition);

          var gunFiring = PIXI.audioManager.getAudio('gunFiring');
          gunFiring.volume = 0.09;
          gunFiring.play();

          if(powerLevel > 4) {
            var bullet = createBullet(cursorPosition, (Math.PI / 8) * 3);
            bullet.direction = 'left';
            bullet = createBullet(cursorPosition, (Math.PI / 8) * 5);
            bullet.direction = 'right';
          }
        }

        firingFrameCount++;
      }

      //
      function createPowerUp(powerUpTexture,enemy){
        powerUp = new PIXI.Sprite(powerUpTexture);
        powerUp.anchor.x = 0.5;
        powerUp.position.y = enemy.position.y;
        powerUp.position.x = enemy.position.x;
        var scale = 100 / powerUp.getBounds().width;
        powerUp.scale.x = scale;
        powerUp.scale.y = scale;
        stage.addChild(powerUp);
        powerUps.push(powerUp);
      }
      for (var i = powerUps.length - 1; i >= 0; i--) {
        var powerUp = powerUps[i];
        powerUp.position.y += 5;

        if (powerUp.position.y > window.innerHeight + powerUp.getBounds().height) {
          stage.removeChild(powerUp);
          powerUps.splice(i, 1);
        }
        if (isIntersecting(avatar.getBounds(), powerUp.getBounds())) {
          switch (powerUp.texture) {
            case resources.extraBullet.texture:
            var powerUpAudio = PIXI.audioManager.getAudio('powerUp');
            powerLevel++;
            powerUpAudio.play();
              break;
            case resources.shield.texture:
               shield = 3;
              break;
            default:

          }
          stage.removeChild(powerUp);
          powerUps.splice(i, 1);
       }
      }

      scoreBoard.text = score.toFixed(0);

      // Generate a new obstacle every so often
      if (bossActivated != 1 && Date.now() - lastObstacle > obstacleRate) {
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

      if (bossActivated !=1 && (Date.now() - lastEnemy > enemyRate)) {
        var toSpawn = 3 + Math.random() * 7;
        for (var i = 0; i < toSpawn; i++) {
          if(hero == "trump"){
            createEnemy(resources['hillary' + (Math.floor(Math.random() * 4) + 1)].texture);
          } else {
            createEnemy(resources['trump' + (Math.floor(Math.random() * 6) + 1)].texture);
          }
        }

        lastEnemy = Date.now();
      };

      for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];

        if (bullet.type == 'enemy') {
          bullet.position.y += 5;

          if (bullet.position.y > window.innerHeight + bullet.getBounds().height) {
            partContainer.removeChild(bullet);
            bullets.splice(i, 1);
          }
        } else {
          bullet.position.y -= 10;
          if (bullet.direction == 'left') {
              bullet.position.x -= 5;
          }
          if(bullet.direction == 'right') {
              bullet.position.x += 5;
          }

          if (bullet.position.y < -bullet.getBounds().height) {
            partContainer.removeChild(bullet);
            bullets.splice(i, 1);
          }
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
          loseGame();
        }
      }

      for (var i = obstacles.length - 1; i >= 0; i--) {
        var obstacle = obstacles[i];
        for (var j = bullets.length - 1; j >= 0; j--) {
          var bullet = bullets[j];

          if (bullet.type == 'enemy') continue;

          if (isIntersecting(obstacle.getBounds(), bullet.getBounds())) {
            partContainer.removeChild(bullet);
            bullets.splice(j, 1);

            addExplosion(bullet.position, 0.25);

            if (obstacle.hitsLeft <= 0) {
              stage.removeChild(obstacle);
              obstacles.splice(i, 1);
              score += 300 * gameSpeed;
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

          if (bullet.type == 'enemy') continue;

          if (isIntersecting(bullet.getBounds(), enemy.getBounds())) {
            score += 100 * gameSpeed

            stage.removeChild(enemy);

            powerUpWeighting = powerUpWeighting + 0.05;

            console.log(powerUpWeighting)

            if(Math.floor(Math.random()*10*gameSpeed - powerUpWeighting) <= 0) {
              if (Math.random() < 0.75) {
                createPowerUp(resources.extraBullet.texture,enemy);
              } else {
                createPowerUp(resources.shield.texture,enemy);
              }
              powerUpWeighting = 0;
            }

            // var enemyDown = PIXI.audioManager.getAudio('enemyDown');
            // enemyDown.play();
            enemies.splice(i, 1);
            //console.log("enemy removed: " + enemies.length)
            partContainer.removeChild(bullet);
            bullets.splice(j, 1);

            //Roll 1 in 50 chance on enemy killed to drop shield powerUp


            addExplosion(enemy.position);
            break;
          }
        }

        if (isIntersecting(avatar.getBounds(), enemy.getBounds())) {
          stage.removeChild(enemy);
          enemies.splice(i, 1);
          loseGame();
        }
      }

      for (var i = enemies.length - 1; i >= 0; i--) {
        var enemy = enemies[i];

        if (Math.random() < 0.001) {
          var bullet = createBullet(enemy.position, -Math.PI / 2);
          bullet.type = 'enemy';
        }
      }

      for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];

        if (bullet.type !== 'enemy') break;

        if (isIntersecting(avatar.getBounds(), bullet.getBounds())) {
          stage.removeChild(bullet);
          bullets.splice(i, 1);
          loseGame();
        }
      }

      function loseGame(){
        if(shield != 0) {
          shield --;
          return;
        }
        endGame.play('endGame');
        stage.removeChild(avatar);
        //Add text to tell user how to restart
        var resetText = new PIXI.Text("Click to play again", {fontFamily : 'Arial', fontSize: 40, fill : 0xff1010, align : 'center'});
        resetText.anchor.x = 0.5;
        resetText.position.x = 600/2;
        resetText.position.y = window.innerHeight/2;
        stage.addChild(resetText);
        addExplosion(avatar.position);
        gameOver = true;
      }
      // this is the main render call that makes pixi draw your container and its children.
      renderer.render(stage);
    }

    $canvas.on('mousedown', function () {
      //firingFrameCount = 0;
      if(gameOver) { //On gameover reset game on mousedown
        endGame.stop();
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
