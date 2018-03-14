import React ,{Component} from 'react';
import WorldGame from './WorldGame';


let canvas = null;
let ctx = null;
let game_screen = null;

class Main extends Component{

  constructor(args) {
    super(args);
  }
  componentWillMount() {

  }
  render() {
    return (<div id = 'game-content'><canvas id='surface'></canvas></div>);
  }
  componentDidMount() {
    this.world = new WorldGame(document.getElementById('surface'));
  }
}

export default Main;
