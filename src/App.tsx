import './App.css';
import * as React from 'react';
import {useMouse} from 'react-use';

import {Engine} from './engine/Engine';
import {defaultScene} from './scenes/defaultScene';

// Engine.
var MainEngine = Engine;

// Scene.
var mainScene: defaultScene = new defaultScene();
mainScene.Load(MainEngine);

// References.
var canvasRef: React.RefObject<HTMLCanvasElement>;
var mouse: ReturnType<typeof useMouse>;

const App = () => {
  // References.
  canvasRef = React.useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  mouse = useMouse(canvasRef);

  // Load scene.
  React.useEffect(() => {
    mainScene.Load(MainEngine);
    return mainScene.Clear(MainEngine);
  }, [])

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
        <p>Blue pilled.</p>
        <canvas 
          ref={canvasRef as React.RefObject<HTMLCanvasElement>} 
          id="main-canvas" 
          width="1280px" 
          height="720px" 
          onMouseEnter={() => MainEngine.pause = !MainEngine.pause}
          onMouseLeave={() => MainEngine.pause = !MainEngine.pause}
        ></canvas>
      </div>
    </>
  );
};

export default App;