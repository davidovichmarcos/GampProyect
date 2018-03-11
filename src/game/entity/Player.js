import Matter from 'matter-js';
let Body = Matter.Body;
export default class Player{

     constructor(body) {
      this.body = body;
      this.x = body.position.x;
      this.y = body.position.y;
      this.onFloor = false;
      this.delta = 0;
      this.movement = 4;
      this.currentJumpTime = null;
      this.lastJumpTime = null
      this.height = (body.height == null) ? body.width :body.height;
      this.width = ( body.width == null) ? 0 : body.width;

      //body properties
      this.mass = 5;
      this.Fx = 0.004 * this.mass; //run Force on ground
      this.Fy = 0.04 * this.mass; //jump
      this.force = 0;
    }

    setPosition(body) {
      this.x = body.position.x;
      this.y = body.position.y;
    }

    getPositionX() {
      return this.x;
    }
    getPositionY() {
      return  this.y;
    }

    update(delta) {
      this.delta = delta;
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

}
