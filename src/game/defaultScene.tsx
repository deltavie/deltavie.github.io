import { Scene } from "../scenes/Scene.tsx";
import * as gameObjects from "./index.tsx";

export class defaultScene extends Scene{
    constructor(){
        super();
        // New character.
        var c01: gameObjects.Character = new gameObjects.Character01();
        this.gameObjects.push(c01)
    }
}