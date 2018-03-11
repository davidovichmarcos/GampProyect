import Matter from 'matter-js';
let Body = Matter.Body;
export default class Player{

     constructor(body) {
      this.body = body;
      this.x = body.position.x;
      this.y = body.position.y;
      this.onFloor = false;
      this.movement = 4;
      this.currentJumpTime = null;
      this.lastJumpTime = null;
      this.width = ( body.width == null) ? 0 : body.width;
      this.height = (body.height == null) ? body.width :body.height;
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
    update (body) {
      this.body;
    }
    getBody() {
      return this.body;
    }
    jump() {

       if(this.onFloor == true){
         Body.setVelocity(this.body,{x:0 , y:-7})
       }
    }
    move(direction) {
      direction.y = direction.y *this.movement;
      direction.x = direction.x *this.movement;
      Body.setVelocity(this.body, direction);
    }
}
