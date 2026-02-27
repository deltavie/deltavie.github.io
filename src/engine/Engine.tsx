import {useMouse} from 'react-use';

import { GameObject } from './GameObject';
import { Camera } from './Camera';

var MainCamera: Camera = new Camera();

// Main export class.
export class EngineObj {
    // Engine parameters.
    deltaTime: number;
    private lastTimestamp: number = 0;;
    pause: boolean;
    engineTimerId: number;
    mouse: ReturnType<typeof useMouse> | null = null;

    // Objects.
    private gameObjects: GameObject[];
    private objectsToInstantiate: GameObject[];
    private objectsToDelete: GameObject[];

    // Default constructor.
    constructor(){
        this.deltaTime = 0;
        this.pause = false;
        this.engineTimerId = 0;
        this.gameObjects = [];
        this.objectsToInstantiate = [];
        this.objectsToDelete = [];
    }

    // Run the engine.
    Clock(mouse: ReturnType<typeof useMouse>, canvas: HTMLCanvasElement, timestamp: DOMHighResTimeStamp){
        this.deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.mouse = mouse;
        this.Logic(mouse);
        this.Render(canvas);
    }

    // Logic update.
    private Logic(mouse: ReturnType<typeof useMouse>){
        mouseX = mouse.elX;
        mouseY = mouse.elY;
        // Run object logic.
        this.gameObjects.forEach((obj) => {
            obj.Update();
        })
        // We create new objects and delete objects when there are no new interactions to avoid changing arrays while they are in use.
        // Instantiate new objects.
        if(this.objectsToInstantiate.length >= 1){
            for(var i=0; i<this.objectsToInstantiate.length;i++){
                this.gameObjects.push(this.objectsToInstantiate[i]);
            }
            this.objectsToInstantiate = [];
            var sortedGameObjects = this.gameObjects.sort((n1,n2) => {
                if (n1.transform.zIndex > n2.transform.zIndex) return 1;
                if (n1.transform.zIndex < n2.transform.zIndex) return -1;
                return 0;
            }); // Sort by layers.
            this.gameObjects = sortedGameObjects;
        }
        // Delete objects.
        if(this.objectsToDelete.length >= 1){
            for(var i=0; i<this.objectsToDelete.length;i++){
                const index = this.gameObjects.findIndex((element) => element == this.objectsToDelete[i]);
                if (index > -1) {
                    this.gameObjects.splice(index, 1);
                }
            }
            this.objectsToDelete = [];
        }
    }

    // Render update.
    private Render(canvas: HTMLCanvasElement){
        const ctx = canvas.getContext("2d");
        if(!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear.
        RenderGameObjects(ctx, this.gameObjects as [GameObject], MainCamera); // Render objects.
        RenderLine(ctx);
    }

    // Add game object.
    Instantiate(object: GameObject){
        this.objectsToInstantiate.push(object);
    }

    // Destory game object.
    Destroy(object: GameObject){
        this.objectsToDelete.push(object);
    }
}
export const Engine: EngineObj = new EngineObj(); // Export an engine to use.

// Render objects function.
function RenderGameObjects(ctx: CanvasRenderingContext2D, gameObjects: [GameObject], camera: Camera){
    if(gameObjects.length <= 0) return; // Do not render empty lists.
    var cameraTransform = camera.transform;
    for(var i=0; i<gameObjects.length; i++){
        var obj = gameObjects[i];
        if(!obj.visible || !obj.spriteImage) continue; // Do not render invisible/missing sprite.
        var transform = obj.transform;
        var sprite = obj.sprite;
        ctx.drawImage
        (
            obj.spriteImage as HTMLImageElement, 
            sprite.sX, sprite.sY, sprite.sWidth, sprite.sHeight, 
            transform.x-sprite.width/2-cameraTransform.x, transform.y-sprite.height/2-cameraTransform.y, sprite.width, sprite.height
        )
        continue;
    }
}

var mouseX = 0;
var mouseY = 0;
var lastX = 0;
var lastY = 0;
function RenderLine(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = "white";
    ctx.stroke();
    lastX = mouseX;
    lastY = mouseY;
}