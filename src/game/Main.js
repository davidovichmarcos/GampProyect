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

    return (<div id = 'game-content'></div>);
  }
  componentDidMount() {
    this.world = new WorldGame();
  }
}

export default Main;
