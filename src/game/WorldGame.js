import Matter from 'matter-js';
import Player from './entity/Player';
import Enemy from './entity/Enemy';
import TerrainGenerator from './entity/TerrainGenerator';

const SCALE = 100;
let pause = true;
let makingMode = false;
let lastPress = null;
let pressingKeys =[];
let mouse  = { click : false, position : {x : 0,y : 0}};
var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Body = Matter.Body,
            Bounds = Matter.Bounds,
            Events = Matter.Events,
            Bodies = Matter.Bodies,
            Vertices = Matter.Vertices,
            Vector = Matter.Vector;

const keys = {
  KEY_ENTER : 13,
  KEY_LEFT : 37,
  KEY_UP  : 38,
  KEY_RIGHT : 39,
  KEY_DOWN : 40,
  KEY_SPACE : 32,
  M : 77 //making mode
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
    this.terrain = null;
    this.world = null;

    this.loadListeners();
    this.loadObjects();
    this.init();
  }

  loadObjects() {
    // Create Objects
     this.player = new Player(Bodies.rectangle(400, 300, 25, 25), Matter);
     this.enemy = new Enemy(Bodies.rectangle(500, 300, 35, 35), Matter);
     this.enemy2 = new Enemy(Bodies.rectangle(1200, 300, 35, 35), Matter);
     this.terrain = new TerrainGenerator(this.WIDHT, this.HEIGHT, Matter);
  }

  loadListeners() {
    document.addEventListener('keydown',(evt) => {
      //console.log(evt.keyCode);
      lastPress = evt.keyCode;
      pressingKeys[evt.keyCode] = true;
      if(pressingKeys[keys.M]){
        if(makingMode) {
          makingMode = false;
        } else{
          makingMode = true;
        }
      }
    }, false);

    document.addEventListener('keyup',(evt) => {
      pressingKeys[evt.keyCode] = false;
    }, false);

    document.addEventListener('touchdown',(evt) => {
      mouse.click = true;
      mouse.position = { x : evt.clientX, y : evt.clientY };

      if(evt.clientX > this.WIDHT) {
        pressingKeys[keys.KEY_LEFT] = true;
      } else{
        pressingKeys[keys.KEY_RIGHT] = true;
      }
    }, false);

    document.addEventListener('touchup',(evt) => {
      mouse.click = false;
      if(evt.clientX > this.WIDHT) {
        pressingKeys[keys.KEY_LEFT] = false;
      } else{
        pressingKeys[keys.KEY_RIGHT] = false;
      }
    }, false);

    document.addEventListener('mousedown',(evt) => {
      mouse.click = true;
    }, false);

    document.addEventListener('mouseup',(evt) => {
      mouse.click = false;
    }, false);

    document.addEventListener('mousemove',(evt) => {
      mouse.position = { x : evt.clientX, y : evt.clientY };
    }, false);
  }

  init() {
    // create engine
    let engine = Engine.create();
    this.world =  engine.world;

    let self = this;
    // create renderer
    let render = Render.create({
        canvas: self.canvas,
        engine: engine,
        options: {
            width: this.WIDHT,
            height: this.HEIGHT,
            //showVelocity: true, this flag shows a blue line highlighting velocity
            wireframes: false
        }
    });

    Render.run(render);
    // create runner
    let runner = Runner.create();
    Runner.run(runner, engine);

    let timing = () => {
      this.cycle++; //tracks game cycles
      //delta is used to adjust forces on game slow down;
      this.delta = (engine.timing.timestamp - this.lastTimeStamp) / 16.666666666666;
      this.lastTimeStamp = engine.timing.timestamp; //track last engine timestamp
    }

    // add bodies
    World.add(this.world, this.player.getBody());
    World.add(this.world, this.enemy.getBody());
    World.add(this.world, this.enemy2.getBody());
    World.add(this.world, this.terrain.getTerrain());
    //passes world to entities
    this.terrain.initMakingMode(this.world);
    this.player.setWorldGame(this);
    this.enemy.setWorldGame(this);
    this.enemy2.setWorldGame(this);

    Events.on(engine, 'beforeUpdate', event => {
      if(!makingMode) {
        this.terrain.validateRemaining();
        // Camera Following the Player.
        //Bounds.translate(render.bounds, {x:this.player.getBody().velocity.x,y:this.player.getBody().velocity.y});

        this.player.update(this.delta);
        this.enemy.update(this.delta);
        this.enemy2.update(this.delta);

        //Player Movement
        if(pressingKeys[keys.KEY_UP]){
          this.player.jump();
        } else if(pressingKeys[keys.KEY_RIGHT]){
          this.player.moveRight();
          //Body.setVelocity(this.player.getBody(), );
        } else if(pressingKeys[keys.KEY_LEFT]){
          this.player.moveLeft();
          //Body.setVelocity(this.player.getBody(), { x: -movement*1.5, y: 0 });
        }

        if(mouse.click) {
          this.player.shoot(mouse.position);
        }

        timing();

      } else{
        this.makeText("MAKING MODE");
        this.terrain.drawShadowPlatform(mouse.position);
        if(mouse.click) {
          //If click is on gets the last platform and create a new one to be move after
          this.terrain.persistChanges();
        }
      }

    });

    Events.on(engine,'collisionActive',event => {
      this.handleActiveCollision(event);
    });

    Events.on(engine,'collisionEnd',event => {
      this.handleEndCollision(event);
    });

  }

  getPlayer() {
    return this.player;
  }

  random(max) {
   return Math.floor(Math.random() * max);
  }

  makeText(message) {
    let context = this.canvas.getContext('2d');
    context.font = '48px serif';
    context.textAlign = "center";
    context.strokeText(message, this.WIDHT /2, this.HEIGHT /2);
  }

  handleActiveCollision(event) {
    let length = event.pairs.length;

    for(let i = 0; i < length; i++) {
      let pair = event.pairs[i];

      if((pair.bodyA.label === 'Player' || pair.bodyB.label === 'Player')) {
        this.player.onFloor = true;
      } else if((pair.bodyA.label === 'Portal' || pair.bodyB.label === 'Portal')){
        //console.log("ea");
      } else if((pair.bodyA.label === 'Enemy' || pair.bodyB.label === 'Enemy')){
        this.enemy.onFloor = true;
      }
    //  Matter.Events.trigger(player.body, 'collision', { pair : pair });
    }
  }

  handleEndCollision(event) {
    let length = event.pairs.length;

    for(let i = 0; i < length; i++) {
      let pair = event.pairs[i];

      if((pair.bodyA.label === 'Player' || pair.bodyB.label === 'Player')) {
        this.player.onFloor = false;
      } else if((pair.bodyA.label === 'Portal' || pair.bodyB.label === 'Portal')){

      } else if((pair.bodyA.label === 'Enemy' || pair.bodyB.label === 'Enemy')){
        this.enemy.onFloor = false;
      }
    //  Matter.Events.trigger(player.body, 'collision', { pair : pair });
    }
  }

}
