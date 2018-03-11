export default class TerrainGenerator {

    constructor(WIDHT,HEIGHT,Bodies){
      this.width = WIDHT*10;
      this.height = HEIGHT;
      this.terrain = new Array();
      this.bodyCreator = Bodies;

      this.build();
    }

    build() {
      let iterator = 400;
      while (iterator<this.width) {
        this.terrain.push(this.bodyCreator.rectangle(iterator, this.random(300,600), 800, 50, { isStatic: true ,
          render: {
            fillStyle: 'green',
            strokeStyle: 'green',
            lineWidth: 3
          } }));
        iterator += 800 + this.random(100,200);
      }
    }

    getTerrain() {
      return this.terrain;
    }

    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
