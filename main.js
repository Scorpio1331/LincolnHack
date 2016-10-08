$(function () {

  // You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
  // which will try to choose the best renderer for the environment you are in.
  var renderer = new PIXI.WebGLRenderer(600, window.innerHeight);

  // The renderer will create a canvas element for you that you can then insert into the DOM.
  document.body.appendChild(renderer.view);

  // You need to create a root container that will hold the scene you want to draw.
  var stage = new PIXI.Container();

  var $canvas = $(renderer.view);
  var canvasOffset = $canvas.offset();

  var cursorPosition = { x: 0, y: 0 };

  $canvas.on('mousemove', function (e) {
    cursorPosition.x = e.pageX - canvasOffset.left;
    cursorPosition.y = e.pageY - canvasOffset.top;
  });

  // Declare a global variable for our sprite so that the animate function can access it.
  var bunny = null;

  // load the texture we need
  PIXI.loader.add('bunny', 'images/bunny.jpg').load(function (loader, resources) {
    // This creates a texture from a 'bunny.png' image.
    bunny = new PIXI.Sprite(resources.bunny.texture);

    // Setup the position and scale of the bunny
    bunny.position.x = 400;
    bunny.position.y = 300;

    bunny.scale.x = 2;
    bunny.scale.y = 2;

    // Add the bunny to the scene we are building.
    stage.addChild(bunny);

    // kick off the animation loop (defined below)
    animate();
  });

  function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // each frame we spin the bunny around a bit
    // bunny.rotation += 0.01;

    bunny.position.x = cursorPosition.x;
    bunny.position.y = cursorPosition.y;

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
  }

  $canvas.on('mousedown', projectileShoot);

  function projectileShoot() { 
    console.log('tits');
  }
  
});














