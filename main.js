$(function () {

  PIXI.loader.add('avatar', 'images/survivor-idle_rifle_0.png');
  PIXI.loader.add('bunny', 'images/bunny.jpg');
  PIXI.loader.add('bullet', 'images/bullet.png');

  PIXI.loader.load(function (loader, resources) {

    // You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
    // which will try to choose the best renderer for the environment you are in.
    var renderer = new PIXI.WebGLRenderer(600, window.innerHeight);

    // The renderer will create a canvas element for you that you can then insert into the DOM.
    document.body.appendChild(renderer.view);

    // You need to create a root container that will hold the scene you want to draw.
    var stage = new PIXI.Container();

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

    // Declare a global variable for our sprite so that the animate function can access it.
    var avatar = null;

    // This creates a texture from a 'bunny.png' image.
    avatar = new PIXI.Sprite(resources.avatar.texture);
    var bullets = [];

    // Setup the position and scale of the avatar
    avatar.position.x = 400;
    avatar.position.y = 300;

    avatar.scale.x = 0.5;
    avatar.scale.y = 0.5;
    avatar.rotation = -Math.PI / 2;

    // Add the avatar to the scene we are building.
    stage.addChild(avatar);

    // kick off the animation loop (defined below)
    animate();

    function animate() {
      // start the timer for the next animation loop
      requestAnimationFrame(animate);

      // Make the avatar follow the cursor
      avatar.position.x = cursorPosition.x - avatar.getBounds().width / 2 - 20;
      avatar.position.y = cursorPosition.y + avatar.getBounds().height / 2;

      // this is the main render call that makes pixi draw your container and its children.
      renderer.render(stage);
    }

    $canvas.on('mousedown', projectileShoot);

    function projectileShoot() {

        var bullet = new PIXI.Sprite(resources.bullet.texture);
        bullet.scale.x = 0.08;       
        bullet.scale.y = 0.08;
        bullet.position.x = avatar.position.x
        bullet.position.y = avatar.position.y
        bullet.rotation = Math.PI / 2;
        stage.addChild(bullet);
        bullets.push(bullet);

      // for (var i = 0; i < 100; ++i) {
      //   var sprite = new PIXI.Sprite.fromImage("images/twatman.jpg");
      //   partContainer.addChild(sprite);
      // }
    }
  });

});














