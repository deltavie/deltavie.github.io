import './App.css';
import * as React from 'react'
import {useMouse} from 'react-use';

let mouse: any = null;

var lastX = 0;
var lastY = 0;
function RenderLine() {
  if(!refCanvas && !refCanvas.current) return;
  const ctx = refCanvas.current.getContext("2d");
  const { width: displayWidth, height: displayHeight } = refCanvas.current.getBoundingClientRect();
  refCanvas.current.width = displayWidth;
  refCanvas.current.height = displayHeight;
  if(!ctx) return;
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(mouse.elX, mouse.elY);
  ctx.stroke();
  lastX = mouse.elX;
  lastY = mouse.elY;
}

// Engine.
let refCanvas: any = null;
var frameCounter = 0;
var pauseEngine = true;
var engineTimerId = 0;
// Start stop engine when pauseEngine changes.
function Engine(){
  if(!pauseEngine){
    // Self calling animation frame counter.
    const updateFrameCounter = () => {
      frameCounter += 1;
      engineTimerId = requestAnimationFrame(updateFrameCounter);
    }
    // Call first animation frame.
    engineTimerId = requestAnimationFrame(updateFrameCounter);
  }else{
    cancelAnimationFrame(engineTimerId);
  }
}
// Render.
function Render(){
  RenderLine();
}

const App = () => {
  // References.
  refCanvas = React.useRef<HTMLCanvasElement>(null);
  mouse = useMouse(refCanvas);

  // Engine.
  React.useLayoutEffect(Engine, [pauseEngine]);
  React.useEffect(Render, [frameCounter])

  return (
    <>
      <div className="content">
        <h1>&gt;///&lt;</h1>
        <p>This is a subheading!</p>
        <canvas ref={refCanvas} id="main-canvas" width="1280px" height="720px" onClick={() => pauseEngine = !pauseEngine}></canvas>
      </div>
    </>
  );
};

export default App;