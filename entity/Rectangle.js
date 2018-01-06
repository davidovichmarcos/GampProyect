
class Rectangle{

     constructor(x = 0, y = 0,width,height) {
      this.x = x;
      this.y = y;
      this.width = ( width == null) ? 0 : width;
      this.height = (height == null) ? this.width :height;
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;
    }

    getPositionX() {
      return this.x;
    }
    getPositionY() {
      return  this.y;
    }
}
