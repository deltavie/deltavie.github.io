import "./index.css"
import { Engine } from "./engine/Engine";
import { defaultScene } from "./game/defaultScene";

// Engine.
var MainEngine = Engine;
// Scene.
var mainScene: defaultScene = new defaultScene();

// Create app page.
const rootEl = document.querySelector('#root');
if (rootEl) {
  rootEl.innerHTML = `
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"></meta>
    <div class="content">
      <h1>deltavie.github.io</h1>
      <p>Blue pilled.</p>
      <canvas 
        id="main-canvas" 
        width="1280px" 
        height="720px" 
      ></canvas>
    </div>
  `;

  function ToggleEngine() { // Turn engine on and off.
    if (MainEngine.pause) {
      // Engine loop.
      const nextFrame = (timestamp: DOMHighResTimeStamp) => {
        MainEngine.Clock(timestamp);
        MainEngine.engineTimerId = requestAnimationFrame(nextFrame);
      }
      // Call first engine loop.
      MainEngine.engineTimerId = requestAnimationFrame(nextFrame);
    } else {
      cancelAnimationFrame(MainEngine.engineTimerId);
    }
  }

  // Initialize Engine.
  const canvasRef = rootEl.querySelector("#main-canvas");
  if (canvasRef) {
    var canvas = canvasRef as HTMLCanvasElement;

    // Initialize Engine.
    MainEngine.Initialize(canvas);
    // Set up event listeners.
    canvas.addEventListener("mousemove", (event) => {
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
    mainScene.Load(); // Load default scene.

    // More canvas listeners.
    canvas.addEventListener("mouseenter", () => {
      MainEngine.pause = !MainEngine.pause;
      ToggleEngine();
    })
    canvas.addEventListener("mouseleave", () => {
      MainEngine.pause = !MainEngine.pause;
      ToggleEngine();
    })
  }
}