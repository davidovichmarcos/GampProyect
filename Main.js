window.addEventListener('load',() => new Main(), false);
let canvas = null;
let ctx = null;
let game_screen = null;

class Main {

  constructor() {

    //Get canvas
    canvas = document.getElementById('canvas');
    game_screen = new Screen(canvas);

    this.world = new WorldGame(game_screen);
    this.renderer = new WorldGameRender(game_screen, this.world);
  }

}
