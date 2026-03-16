import {useMouse} from 'react-use';

import { GameObject } from './GameObject';
import { Camera } from './Camera';
import { webglRenderer } from './webgl/WebGLRenderer';
import {vec3, vec4, mat4} from "./webgl/gl-matrix-min.js"

var MainCamera: Camera = new Camera();

// Main export class.
export class EngineObj {
    // Engine parameters.
    deltaTime: number; // In seconds.
    private lastTimestamp: number = 0;;
    pause: boolean;
    engineTimerId: number;
    mouse: ReturnType<typeof useMouse> | null = null;

    // Renderer.
    renderer: webglRenderer = new webglRenderer();

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
        MainCamera.transform.position = {x:0,y:0,z:2,w:0};
        MainCamera.LookAt = {x:0,y:0,z:0};
    }

    // Initialize the engine.
    Initialize(canvas: HTMLCanvasElement){
        this.renderer.Initialize(canvas);
    }

    invMousePos = vec4.create();
    // Run the engine.
    Clock(mouse: ReturnType<typeof useMouse>, timestamp: DOMHighResTimeStamp){
        this.deltaTime = (timestamp - this.lastTimestamp)/1000;
        this.lastTimestamp = timestamp;
        this.mouse = mouse;
        this.Logic();
        this.Render();
        // Mouse position test. this works, inv(pespective*view*modelview)*point
        // if(!this.renderer.glContext) return;
        // const modelViewMatrix = mat4.create();
        // mat4.translate(
        //     modelViewMatrix, // destination matrix
        //     modelViewMatrix, // matrix to translate
        //     [
        //         -MainCamera.transform.position.x,
        //         -MainCamera.transform.position.y,
        //         -MainCamera.transform.position.z,
        //     ],
        // );
        // var combinedMat1 = mat4.create();
        // mat4.multiply(combinedMat1, this.renderer.viewMatrix, modelViewMatrix);
        // var combinedMat2 = mat4.create();
        // mat4.multiply(combinedMat2, this.renderer.projectionMatrix, combinedMat1);
        // var invMat = mat4.create();
        // mat4.invert(invMat, combinedMat2);
        // var mousePos = vec4.create();
        // mousePos[0] = 2*(mouse.elX/mouse.elW)-1;
        // mousePos[1] = 1-2*(mouse.elY/mouse.elH);
        // mousePos[2] = 0.98;
        // mousePos[3] = 1;
        // vec4.transformMat4(this.invMousePos, mousePos, invMat);
        // var wInv = 1/this.invMousePos[3];
        // this.invMousePos[0] = this.invMousePos[0]*wInv; // Divide by w after multiplication.
        // this.invMousePos[1] = this.invMousePos[1]*wInv;
        // this.invMousePos[2] = this.invMousePos[2]*wInv;
    }

    // Logic update.
    private Logic(){
        // Run object logic.
        this.gameObjects.forEach((obj) => {
            obj.Update();
        })
        // We create new objects and delete objects when there are no new interactions to avoid changing arrays while they are in use.
        // Instantiate new objects.
        if(this.objectsToInstantiate.length >= 1){
            for(var i=0; i<this.objectsToInstantiate.length;i++){
                this.gameObjects.push(this.objectsToInstantiate[i]);
                this.objectsToInstantiate[i].Instantiated();
            }
            this.objectsToInstantiate = [];
        }
        // Delete objects.
        if(this.objectsToDelete.length >= 1){
            for(var i=0; i<this.objectsToDelete.length;i++){
                const index = this.gameObjects.findIndex((element) => element == this.objectsToDelete[i]);
                if (index > -1) {
                    this.objectsToDelete[i].Destroyed();
                    this.gameObjects.splice(index, 1);
                }
            }
            this.objectsToDelete = [];
        }
    }

    // Render update.
    private Render(){
        this.renderer.Render(this.gameObjects, MainCamera);
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