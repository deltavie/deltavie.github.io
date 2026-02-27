import type { GameObject } from "../engine/GameObject";
import {Engine} from '../engine/Engine';

export class Scene {
    gameObjects: GameObject[];
    constructor(){
        this.gameObjects = [];
    }
    // Load and clear scene.
    Load(Engine: Engine){
        this.gameObjects.forEach(obj => {
            Engine.Instantiate(obj);
        });
    }
    Clear(Engine: Engine){
        this.gameObjects.forEach(obj => {
            Engine.Destroy(obj);
        });
    }
}