export default class TerrainGenerator {

    constructor(WIDHT, HEIGHT, Matter){
      this.width = WIDHT*2;
      this.height = HEIGHT;
      this.terrain = new Array();
      this.Bodies = Matter.Bodies;
      this.Body = Matter.Body;
      this.Vertices = Matter.Vertices;
      this.Vector = Matter.Vector;
      this.World = Matter.World;
      this.world = null;
      this.currentPlatform = null;
      this.callOnce = false;
      this.currentTime = 0;
      this.lastTime = 0;

      this.defaultTerrain();
    }

    initMakingMode(world) {
      this.world = world;
      this.createPlatform();
    }

    startMakingMode() {
      if(this.callOnce) return;
      this.createPlatform();
      this.callOnce = true;
    }

    persistChanges() {
      this.currentPlatform.shadowMode = false;
      this.callOnce = false;
      this.World.add(this.world, this.currentPlatform);
      this.createPlatform();
      this.lastTime = Date.now() + 500;
    }

    validateRemaining() {
      let lastBody = this.terrain[this.terrain.length - 1];
      if(lastBody.shadowMode == true) this.World.remove(this.world, lastBody);
    }

    createPlatform() {
      let body = this.Bodies.rectangle(0, 0, 300, 50, { isStatic: true ,
          render: {
            fillStyle: '#42ad81bf',
            strokeStyle: '#42ad81bf',
            lineWidth: 3
          } });
      //this flag works to validate if there is a remaining platform at makingmode
      body.shadowMode = true;
      this.terrain.push(body);
      this.currentPlatform = body;
      this.World.add(this.world, this.currentPlatform);
    }

    drawShadowPlatform(position) {
      this.currentTime = Date.now();
      if(this.currentTime > this.lastTime) {
        this.startMakingMode();
        //shows the platform before it's into the world
        let lastBody = this.terrain[this.terrain.length - 1];
        this.Body.translate(lastBody, this.Vector.create(-( lastBody.position.x - position.x ), -( lastBody.position.y - position.y )) );
      }
    }

    getLastPlatform() {
      let lastBody = this.terrain[this.terrain.length - 1];
      return lastBody;
    }

    randomTerrain() {
      let iterator = 400;
      while (iterator<this.width) {
        this.terrain.push(this.Body.rectangle(iterator, this.random(300,600), 800, 50, { isStatic: true ,
          render: {
            fillStyle: 'green',
            strokeStyle: 'green',
            lineWidth: 3
          } }));
        iterator += 800 + this.random(100,200);
      }
    }

    defaultTerrain() {
      this.terrain.push(this.Bodies.rectangle(0, 0, this.width, 50, { isStatic: true ,
        render: {
          fillStyle: 'green',
          strokeStyle: 'green',
          lineWidth: 3
        } }));
      this.terrain.push(this.Bodies.rectangle(0, this.height - 150, this.width, 50, { isStatic: true ,
        render: {
          fillStyle: 'green',
          strokeStyle: 'green',
          lineWidth: 3
        } }));
    }

    getTerrain() {
      return this.terrain;
    }

    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
