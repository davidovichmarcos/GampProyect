import Rectangle from './entity/Rectangle.js';
import Matter from 'matter-js';

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
            Events = Matter.Events,
            Bodies = Matter.Bodies;

const movement = 4;
const keys = {
  KEY_ENTER : 13,
  KEY_LEFT : 37,
  KEY_UP  : 38,
  KEY_RIGHT : 39,
  KEY_DOWN : 40
};

export default class WorldGame {

  constructor() {
    console.log('asdsds');
    this.WIDHT = 800;
    this.HEIGHT = 600;
    this.player = null;
    this.food = null;
    this.loadListeners();
    this.loadObjects();
    this.init();
  }

  loadListeners() {
    document.addEventListener('keydown',(evt) => {
      lastPress = evt.keyCode;
      console.log(evt.keyCode);
      pressingKeys[evt.keyCode] = true;
    }, false);

    document.addEventListener('keyup',(evt) => {
      pressingKeys[evt.keyCode] = false;
    }, false);
  }

  loadObjects() {
    // Create Objects

     this.player = new Rectangle(40,40,50,50);
     this.food = new Rectangle(40, 40,10,10);

  }
  init() {

    // create engine
  var engine = Engine.create(),
      world = engine.world;

  // create renderer
  var render = Render.create({
      element: document.body,
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
 var  player1 = Bodies.rectangle(400, 100, 60, 60);


  // add bodies
  World.add(world,[
      // falling blocks
      player1,
      // walls
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
  ]);
  Events.on(engine, 'beforeUpdate', function(event) {
    //Player Movement
  if(pressingKeys[keys.KEY_RIGHT]){
    Body.setVelocity(player1, { x: movement*1.5, y: 0 });
  }
  if(pressingKeys[keys.KEY_UP]){
    console.log('up');
    Body.setVelocity(player1, { x: 0 , y: -movement*1.5 });
  }
  if(pressingKeys[keys.KEY_LEFT]){
    console.log(85252);
    Body.setVelocity(player1, { x: -movement*1.5, y: 0 });
  }
  if(pressingKeys[keys.KEY_DOWN]){
    console.log(85252);
    Body.setVelocity(player1, { x: 0, y: movement*1.5 });
  }
  if(pressingKeys[keys.KEY_DOWN]&&pressingKeys[keys.KEY_LEFT]){
    console.log(85252);
    Body.setVelocity(player1, { x: -movement, y: movement });
  }
  if(pressingKeys[keys.KEY_DOWN]&&pressingKeys[keys.KEY_RIGHT]){
    console.log(85252);
    Body.setVelocity(player1, { x: movement, y: movement });
  }
  if(pressingKeys[keys.KEY_UP]&&pressingKeys[keys.KEY_LEFT]){
    console.log(85252);
    Body.setVelocity(player1, { x: -movement, y: -movement });
  }
  if(pressingKeys[keys.KEY_UP]&&pressingKeys[keys.KEY_RIGHT]){
    console.log(85252);
    Body.setVelocity(player1, { x: movement, y: -movement });
  }
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
