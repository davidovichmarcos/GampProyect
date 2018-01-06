class Screen {
    constructor(canvas){
      this.width = canvas.width;
      this.height = canvas.height;
      this.ctx = canvas.getContext('2d');
    }
    getScreen(){
      return this;
    }
}
