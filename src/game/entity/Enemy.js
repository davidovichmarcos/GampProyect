const STATE = { looking : "looking", shooting : "shooting"};

export default class Enemy {

     constructor(body, Matter) {
      this.World = Matter.World;
      this.worldGame = null;
      this.world = null;
      this.Bodies = Matter.Bodies;
      this.body = body;
      this.body.label = 'Enemy';
      this.position = body.position;
      this.onFloor = false;
      this.delta = 0;
      this.movement = 4;
      this.height = (body.height == null) ? body.width :body.height;
      this.width = ( body.width == null) ? 0 : body.width;
      this.state = STATE.looking; //set looking for default

      //Shoot logic
      this.minDistanceShoot = 200;
      this.angle = 0;
      this.bullets = new Array();

      //Walk logic
      this.alreadyCalled = false;
      this.walkInterval = null;
      this.targetPosition = this.position.x;
      this.walkDirecction = null;

      //body properties
      this.mass = this.body.mass;
      this.Fx = 0.009 * this.mass; //run Force on ground
      this.Fy = 0.009 * this.mass; //jump
      this.force = 0;
    }

    update(delta) {
      this.delta = delta;
      //this method determines the enemy state by proximity to the target or targets to reach
      this.state = this.detectEnemy(this.worldGame.getPlayer());

      if(this.state === STATE.looking) {
        this.walkAround();
      } else if(this.state === STATE.shooting) {
        this.shoot(this.worldGame.getPlayer());
      }

      this.bulletCycle();
    }

    collision(pair) {
      if(pair.bodyA.label === "Vertical-platform" || pair.bodyB.label === "Vertical-platform") {
        this.walkToOpositeSide();
      }
    }

    setWorldGame(worldGame) {
      this.worldGame = worldGame;
      this.world = worldGame.world;
    }

    setPosition(body) {
      this.x = body.position.x;
      this.y = body.position.y;
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
      if(this.onFloor) this.body.force.x = -this.Fx / this.delta;
    }

    moveRight() {
      if(this.onFloor) this.body.force.x = this.Fx / this.delta;
    }

    shoot(target) {
      //calculates tangente by x,y
      this.angle = Math.atan2(target.getPosition().y - this.position.y, target.getPosition().x - this.position.x);
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
      //validates when a bullet needs to die
      let i = this.bullets.length;
      let currentTime = Date.now();
      while (i--) {
        //if the bullet overcome its time to die it'll die
        if(currentTime > this.bullets[i].birthTime) {
          this.World.remove(this.world, this.bullets[i]);
          this.bullets.splice(i, 1);
        }
      }
    }

    calculateDistance(target) {
      let posX = this.position.x - target.getPosition().x;
      let posY = this.position.y - target.getPosition().y;
      let distance = Math.sqrt((posX * posX) + (posY * posY));
      let isClose = false;

      if(distance <= this.minDistanceShoot) {
        isClose = true;
      } else {
        isClose = false;
      }
      return isClose;
    }

    detectEnemy(target) {
      let isDetecting = this.calculateDistance(target);
      let state = null;

      if(isDetecting) {
        state = STATE.shooting;
      } else{
        state = STATE.looking;
      }
      return state;
    }

    walkAround() {
      //If the player reaches its final position generate a new one to reach and again
      if(this.position.x == this.targetPosition) {
        clearInterval(this.walkInterval);
        this.targetPosition = this.determinateNewPosition();
        this.alreadyCalled = false //this flags allows only call once, cause setInterval handles the movement
      } else if(!this.alreadyCalled) {
        if(this.targetPosition > this.position.x) {
          //right
          console.log("right");
          this.walkDirecction = "rigth";
          this.walkInterval = setInterval(() => this.moveRight(), 350);
        } else{
          //left
          console.log("left");
          this.walkDirecction = "left";
          this.walkInterval = setInterval(() => this.moveLeft(), 350);
        }

        this.alreadyCalled = true;
      }
    }

    walkToOpositeSide() {
      this.alreadyCalled = false;
      if(this.walkDirecction === "left") {
        this.targetPosition = this.position.x + 200;
      } else{
        this.targetPosition = this.position.x - 200;
      }
    }

    determinateNewPosition() {
      let position = 0;
      if(this.random(5) >= 3) {
        position = this.position.x + 200;
      } else {
        position = this.position.x - 200;
      }

      return position;
    }

    random(max) {
     return Math.floor(Math.random() * max);
    }


}
