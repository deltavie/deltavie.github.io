import './App.css';
import * as React from 'react';
import {Engine} from './engine/Engine';
import {defaultScene} from './game/defaultScene';

// Engine.
var MainEngine = Engine;

// Scene.
var mainScene: defaultScene = new defaultScene();

// References.
var canvasRef: React.RefObject<HTMLCanvasElement>;

const App = () => {
  // References.
  canvasRef = React.useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;

  // Startup engine.
  React.useEffect(() => {
    // Init engine.
    MainEngine.Initialize(canvasRef.current);
    // Set up event listeners.
    canvasRef.current.addEventListener("mousemove", (event) => {
      var canvas = canvasRef.current;
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      MainEngine.UpdateMouse({
        elX: (event.clientX - rect.left) * scaleX,
        elY: (event.clientY - rect.top) * scaleY,
        elW: rect.width,
        elH: rect.height
      })
    })
    // Load scene.
    mainScene.Load();
  }, [])


  // Engine loop.
  React.useEffect(() => {
    if(MainEngine.pause){
      // Engine loop.
      const nextFrame = (timestamp: DOMHighResTimeStamp) => {
        MainEngine.Clock(timestamp);
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