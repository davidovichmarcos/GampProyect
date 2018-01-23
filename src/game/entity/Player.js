
export default class Player{

     constructor(body) {
      this.body = body;
      this.x = body.position.x;
      this.y = body.position.y;
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
}
