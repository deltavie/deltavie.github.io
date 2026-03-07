import { Scene } from "./Scene";
import * as gameObjects from "../gameObjects/index.tsx";

export class defaultScene extends Scene{
    constructor(){
        super();
        // New character.
        var c01: gameObjects.Character = new gameObjects.Character01();
        this.gameObjects.push(c01)
        var c02: gameObjects.Character = new gameObjects.Character01();
        this.gameObjects.push(c02)
    }
}