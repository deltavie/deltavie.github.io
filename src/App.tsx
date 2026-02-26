import './App.css';
import * as React from 'react';
import {useMouse} from 'react-use';

import {Engine} from './engine/Engine';
import {images} from './engine/Files';
import { GameObject } from './engine/GameObject';

// Engine.
export var MainEngine: Engine = new Engine();

// References.
var canvasRef: React.RefObject<HTMLCanvasElement>;
var mouse: ReturnType<typeof useMouse>;

// Test.
var oldObj = null;
class testObj extends GameObject {
  progress: number = 0;
  constructor(){
    super();
    this.transform = {
      x: 0,
      y: 0,
      width: 128,
      height: 128,
      sX: 100,
      sY: 100,
      sWidth: 228,
      sHeight: 228,
      zIndex: 0
    }
    this.sprite = new Image();
    this.sprite.src = images["test.png"];
  }
  Update(){
    this.progress += MainEngine.deltaTime;
    this.transform.x = this.transform.x+Math.sin(this.progress);
    this.transform.y = this.transform.y+Math.cos(this.progress);
  }
}
function AddNewTestObject(){
  var NewObj = new testObj()
  NewObj.transform.x =mouse.elX;
  NewObj.transform.y = mouse.elY;
  MainEngine.Instantiate(NewObj);
  if(oldObj){
    MainEngine.Destroy(oldObj);
  }
  oldObj = NewObj;
}

const App = () => {
  // References.
  canvasRef = React.useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  mouse = useMouse(canvasRef);

  // Engine.
  React.useEffect(() => {
    if(MainEngine.pause){
      // Engine loop.
      const nextFrame = (timestamp: DOMHighResTimeStamp) => {
        MainEngine.Clock(mouse, canvasRef.current, timestamp);
        MainEngine.engineTimerId = requestAnimationFrame(nextFrame);
      }
      // Call first engine loop.
      MainEngine.engineTimerId = requestAnimationFrame(nextFrame);
    }else{
      cancelAnimationFrame(MainEngine.engineTimerId);
    }
  }, [MainEngine.pause]) // Logic and render when clock updates.

  // Component HTML.
  return (
    <>
      <div className="content">
        <h1>deltavie.github.io</h1>
        <p>Mogmaxxing.</p>
        <canvas 
          ref={canvasRef as React.RefObject<HTMLCanvasElement>} 
          id="main-canvas" 
          width="1280px" 
          height="720px" 
          onMouseEnter={() => MainEngine.pause = !MainEngine.pause}
          onMouseLeave={() => MainEngine.pause = !MainEngine.pause}
          onClick={() => AddNewTestObject()}
        ></canvas>
      </div>
    </>
  );
};

export default App;