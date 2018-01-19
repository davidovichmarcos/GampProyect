
class WorldGameRender{

  constructor(game_screen, world) {
    console.log(game_screen);
    this.WIDHT = game_screen.width;
    this.HEIGHT = game_screen.height;
    this.ctx = game_screen.ctx;

    this.world = world;
    this.player = this.world.getPlayer();

    this.init();
  }

  render(){
    //Clear Canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0,0,this.WIDHT,this.HEIGHT);

    //Update player
    this.updatePlayer(this.player);
  }

  updatePlayer(player){
    this.ctx.fillStyle = '#f829';
    this.ctx.fillRect(player.x,player.y,player.width,player.height);
  }

  init() {
    window.requestAnimationFrame(() => this.init());
    this.render();
  }

}
export default WorldGameRender;
