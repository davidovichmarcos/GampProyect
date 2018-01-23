
export default class Camera {

  constructor (width, height) {
    this.HEIGHT = height;
    this.WIDHT = width;
  }

  focus(x, y) {
    this.x = x - this.WIDHT /2;
    this.y = y - this.HEIGHT /2;
  }
}
