export default class Player {

     constructor(body, Matter, worldGame) {
      this.World = Matter.World;
      this.worldGame = null;
      this.world = null;
      this.Bodies = Matter.Bodies;
      this.body = body;
      this.body.label = 'Player';
      this.position = body.position;
      this.onFloor = false;
      this.delta = 0;
      this.movement = 4;
      this.currentJumpTime = null;
      this.lastJumpTime = null
      this.height = (body.height == null) ? body.width :body.height;
      this.width = ( body.width == null) ? 0 : body.width;
      this.sight = null; //sight means mira
      this.angle = 0;
      this.bullets = new Array();

      //body properties
      this.mass = this.body.mass;
      this.Fx = 0.004 * this.mass; //run Force on ground
      this.Fy = 0.04 * this.mass; //jump
      this.force = 0;
    }

    update(delta, world) {
      this.delta = delta;
      this.bulletCycle();
    }

    setWorldGame(worldGame) {
      this.worldGame = worldGame;
      this.world = worldGame.world;
    }

    setPosition(body) {
      this.position.x = body.position.x;
      this.position.y = body.position.y;
    }

    getPosition() {
      return this.position;
    }

    getBody() {
      return this.body;
    }

    jump() {
      if(this.onFloor == true){
        this.body.force.y = -this.Fy / this.delta;
      }
    }

    moveLeft() {
      if(this.onFloor == true) this.body.force.x = -this.Fx / this.delta;
    }

    moveRight() {
      if(this.onFloor == true) this.body.force.x = this.Fx / this.delta;
    }

    shoot(position) {
      //calculates tangente by x,y
      this.angle = Math.atan2(position.y - this.position.y, position.x - this.position.x);
      const len = this.bullets.length;
      //bullet[len] = Bodies.polygon(e.x - mech.transX, e.y- mech.transY, 5, 5);
      const dist = 15 //radial distance mech head
      const dir = (Math.random() - 0.5) * 0.1 + this.angle;
      //spawn as a rectangle
      this.bullets[len] = this.Bodies.rectangle(this.position.x + Math.cos(this.angle), this.position.y + Math.sin(this.angle), 10, 3, {
        angle: dir,
        //density: 0.001,
        //friction: 0.05,
        frictionAir: 0,
        //frictionStatic: 0.2,
        restitution: 0.25,
        //sleepThreshold: 30, //bullets despawn on sleep after __ cycles
        collisionFilter: {
          group: -2 //can't collide with player (at first)
        }
      });

      //add force to fire bullets
      const vel = 0.0025;
      const f = {
        x: vel * Math.cos(dir) / this.delta,
        y: vel * Math.sin(dir) / this.delta
      }
      this.bullets[len].force = f;
      this.bullets[len].label = 'Portal';
      this.bullets[len].birthTime = Date.now() + 5000;

      this.World.add(this.world, this.bullets[len]); //add bullet to world
    }

    bulletCycle() {
      //all bullet loop
      let i = this.bullets.length;
      let currentTime = Date.now();
      while (i--) {
        //soon after spawn bullets can collide with player
        //this may need to be removed
        if(currentTime > this.bullets[i].birthTime) {
          this.World.remove(this.world, this.bullets[i]);
          this.bullets.splice(i, 1);
        }
      }
    }



}
