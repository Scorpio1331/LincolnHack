function isIntersecting(r1, r2) {
  return !(
    r2.x > (r1.x + r1.width) ||
    (r2.x + r2.width) < r1.x ||
    r2.y > (r1.y + r1.height) ||
    (r2.y + r2.height) < r1.y
  );
}

$(function () {

  PIXI.loader.add('avatar', 'images/survivor-idle_rifle_0.png');
  PIXI.loader.add('bunny', 'images/bunny.jpg');
  PIXI.loader.add('bullet', 'images/bullet.png');
  PIXI.loader.add('background', 'images/concrete_texture.jpg');

  PIXI.loader.load(function (loader, resources) {

    // You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
    // which will try to choose the best renderer for the environment you are in.
    var renderer = new PIXI.WebGLRenderer(600, window.innerHeight);

    // The renderer will create a canvas element for you that you can then insert into the DOM.
    document.body.appendChild(renderer.view);


    // You need to create a root container that will hold the scene you want to draw.
    var stage = new PIXI.Container();

    var backgroundImg = new PIXI.extras.TilingSprite(resources.background.texture, 600, window.innerHeight);
    stage.addChild(backgroundImg);

    var partContainer = new PIXI.particles.ParticleContainer(10000, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });
    stage.addChild(partContainer);

    var $canvas = $(renderer.view);
    var canvasOffset = $canvas.offset();

    var cursorPosition = { x: 0, y: 0 };

    $canvas.on('mousemove', function (e) {
      cursorPosition.x = e.pageX - canvasOffset.left;
      cursorPosition.y = e.pageY - canvasOffset.top;
    });

    var isMouseDown = false;
    var firingFrameCount = 0;
    // One projectile every 10 frames
    var fireRate = 10;

    var avatar = new PIXI.Sprite(resources.avatar.texture);
    avatar.position.x = 400;
    avatar.position.y = 300;
    avatar.scale.x = 0.5;
    avatar.scale.y = 0.5;
    avatar.rotation = -Math.PI / 2;
    stage.addChild(avatar);

    var obstacles = [];
    var lastObstacle = Date.now();
    var obstacleRate = 3000;

    var bullets = [];

    // kick off the animation loop (defined below)
    animate();

    function animate() {
      backgroundImg.tilePosition.y += 4;

      // start the timer for the next animation loop
      requestAnimationFrame(animate);

      // Make the avatar follow the cursor
      avatar.position.x = cursorPosition.x - avatar.getBounds().width / 2 - 20;
      avatar.position.y = cursorPosition.y + avatar.getBounds().height / 2;



      if (isMouseDown) {
        if (firingFrameCount % fireRate == 0) {
          var bullet = new PIXI.Sprite(resources.bullet.texture);
          bullet.scale.x = 0.08;
          bullet.scale.y = 0.08;
          bullet.position.x = cursorPosition.x;
          bullet.position.y = cursorPosition.y;
          bullet.rotation = Math.PI / 2;
          partContainer.addChild(bullet);
          bullets.push(bullet);
        }
        firingFrameCount++;
      }

      // Generate a new obstacle every so often
      if (Date.now() - lastObstacle > obstacleRate) {
        var obstacle = new PIXI.Text('@RandomUser', {
          font: '35px Arial',
          align: 'center',
          backgroundColor: 'black'
        });
        obstacle.position.x = 0;
        obstacle.position.y = -obstacle.getBounds().height;
        stage.addChild(obstacle);
        obstacles.push(obstacle);
        lastObstacle = Date.now();
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
        obstacle.position.y += 4;

        if (obstacle.position.y > window.innerHeiht + obstacle.getBounds().height) {
          stage.removeChild(obstacle);
          obstacles.splice(i, 1);
        }

        if (isIntersecting(avatar.getBounds(), obstacle.getBounds())) {
          console.log('intersect');
        }
      }

      // this is the main render call that makes pixi draw your container and its children.
      renderer.render(stage);
    }

    $canvas.on('mousedown', function () {
      firingFrameCount = 0;
      isMouseDown = true;
    });
    $canvas.on('mouseup', function () {
      isMouseDown = false;
    });
  });

});














