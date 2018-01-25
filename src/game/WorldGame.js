import Player from './entity/Player.js';
import Camera from './Camera.js';
import Matter from 'matter-js';

const SCALE = 100;
let pause = true;
let lastPress = null;
let pressingKeys =[];
var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Body = Matter.Body,
            Bounds = Matter.Bounds,
            Events = Matter.Events,
            Bodies = Matter.Bodies;



const keys = {
  KEY_ENTER : 13,
  KEY_LEFT : 37,
  KEY_UP  : 38,
  KEY_RIGHT : 39,
  KEY_DOWN : 40,
  KEY_SPACE : 32
};

let izq = false;

export default class WorldGame {

  constructor(surface) {
    this.canvas = surface;
    this.canvas.width = window.innerWidth-4;
    this.canvas.height = window.innerHeight-4;
    this.WIDHT = this.canvas.width;
    this.HEIGHT = this.canvas.height;
    this.player = null;
    this.cam = null;
    this.loadListeners();
    this.loadObjects();
    this.init();
  }
  loadObjects() {
    // Create Objects
     this.player = new Player(Bodies.rectangle(400, 300, 60, 60));
     this.cam = new Camera(this.WIDHT,this.HEIGHT);

  }
  loadListeners() {
    document.addEventListener('keydown',(evt) => {
      lastPress = evt.keyCode;
      console.log(evt.keyCode);
      pressingKeys[evt.keyCode] = true;
    }, false);

    document.addEventListener('touchdown',(evt) => {
      if(evt.clientX > this.WIDHT) {
        pressingKeys[keys.KEY_LEFT] = true;
      } else{
        pressingKeys[keys.KEY_RIGHT] = true;
      }
    }, false);

    document.addEventListener('touchup',(evt) => {
      if(evt.clientX > this.WIDHT) {
        pressingKeys[keys.KEY_LEFT] = false;
      } else{
        pressingKeys[keys.KEY_RIGHT] = false;
      }
    }, false);
    document.addEventListener('keyup',(evt) => {
      pressingKeys[evt.keyCode] = false;
    }, false);
  }


  init() {

    // create engine
  var engine = Engine.create(),
      world = engine.world;

      let self = this;

  // create renderer
  var render = Render.create({
      canvas: self.canvas,
      engine: engine,
      options: {
          width: this.WIDHT,
          height: this.HEIGHT,
          showVelocity: true
      }
  });

  Render.run(render);

  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);


  // add bodies
  World.add(world,[
      // falling blocks
      this.player.getBody(),
      // walls
      Bodies.rectangle(4*SCALE, 0, 8*SCALE, 50, { isStatic: true }),
      Bodies.rectangle(4*SCALE, 6*SCALE, 8*SCALE, 50, { isStatic: true }),
      Bodies.rectangle(1300, 6*SCALE, 8*SCALE, 50, { isStatic: true })
  ]);

  Events.on(engine, 'beforeUpdate', event => {

    // Camera Following the Player.
    Bounds.translate(render.bounds, {x:this.player.getBody().velocity.x,y:this.player.getBody().velocity.y});
      //Player Movement

    if(pressingKeys[keys.KEY_SPACE]){
      this.player.jump();
    }
    if(pressingKeys[keys.KEY_RIGHT]){
      this.player.move({ x:1.5, y: 0 });
      //Body.setVelocity(this.player.getBody(), );
    }
    if(pressingKeys[keys.KEY_LEFT]){
      this.player.move({ x: -1.5, y: 0 });
      //Body.setVelocity(this.player.getBody(), { x: -movement*1.5, y: 0 });
    }
    if(pressingKeys[keys.KEY_DOWN]){
      this.player.move({ x: 0, y: 1.5 });
    }
    if(pressingKeys[keys.KEY_DOWN]&&pressingKeys[keys.KEY_LEFT]){
      this.player.move({ x: -1, y: 1 });
    }
    if(pressingKeys[keys.KEY_DOWN]&&pressingKeys[keys.KEY_RIGHT]){
      this.player.move({ x: 1, y: 1 });

    }
    if(pressingKeys[keys.KEY_SPACE]&&pressingKeys[keys.KEY_LEFT]){
      this.player.jump();
      this.player.move({ x: -1, y: -1 });

    }
    if(pressingKeys[keys.KEY_SPACE]&&pressingKeys[keys.KEY_RIGHT]){
      this.player.jump();
      this.player.move({ x: 1, y: -1 });
    }
});
Events.on(engine,'collisionActive',event => {
  this.player.onFloor = true;
});
Events.on(engine,'collisionEnd',event => {
  this.player.onFloor = false;
});
  // add mouse control
  var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
              stiffness: 0.2,
              render: {
                  visible: false
              }
          }
      });

  World.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 }
  });
  }

  getPlayer() {
    return this.player;
  }

  random(max) {
   return Math.floor(Math.random() * max);
  }

}
