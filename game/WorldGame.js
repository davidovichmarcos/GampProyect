let pause = true;
let lastPress = null;
let pressingKeys =[];

const keys = {
  KEY_ENTER : 13,
  KEY_LEFT : 37,
  KEY_UP  : 38,
  KEY_RIGHT : 39,
  KEY_DOWN : 40
};

class WorldGame{

  constructor(game_screen) {
    console.log(game_screen);
    this.WIDHT = game_screen.getScreen().width;
    this.HEIGHT = game_screen.getScreen().height;

    this.loadListeners();
    this.loadObjects();
    this.run();
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

  run() {
    setTimeout(() => this.run(),50);

   //setInterval();
   this.act();
  }

  getPlayer() {
    return this.player;
  }

  act() {

   if(!pause) {
     //Change direction
     if (pressingKeys[keys.KEY_UP]) {

       this.player.y -= 10;
     }
     if (pressingKeys[keys.KEY_DOWN]) {
       this.player.y += 10;
     }
     if (pressingKeys[keys.KEY_RIGHT]) {
       this.player.x += 10;
     }
     if (pressingKeys[keys.KEY_LEFT]) {
       this.player.x -= 10;
     }


     // Out Screen
     if (this.player.getPositionX()> this.WIDHT) {
         this.player.getPositionX() = 0;
     }
     if (this.player.getPositionY() > this.HEIGHT) {
         this.player.getPositionY() = 0;
     }
     if (this.player.getPositionX() < 0) {
       this.player.getPositionX() = this.WIDHT;
     }
     if (this.player.getPositionY() < 0) {
       this.player.getPositionY() = this.WIDHT;
     }

   }
   /*//Food intersects
   if (player.intersects(food)) {
     score += 1;
     food.position.x = random(canvas.width / 10 - 1)*10;
     food.position.y = random(canvas.height/ 10 - 1)*10;
   }*/
    // Pause/unpause
    if (lastPress == keys.KEY_ENTER) {
      pause = !pause;
      lastPress = null;
   }
  }

  intersects(obj, obj2) {
    if (obj == null ) {
      window.console.warn('Missing parameters on function intersects');
      return null;
    }

    return (obj.x < obj2.x + obj2.width &&
            obj.x + obj.width > obj2.x &&
            obj.y < obj2.y + obj2.height &&
            obj.y + obj.height > obj2.y);
    }

  random(max) {
   return Math.floor(Math.random() * max);
  }

}
