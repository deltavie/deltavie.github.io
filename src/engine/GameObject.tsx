import type { Sprite } from "./components/Sprite";
import type { Vec4 } from "./dataTypes/Vectors";

interface Transform {
    position: Vec4;
    rotation: Vec4;
}

export class GameObject{
    // State.
    active: boolean;
    visible: boolean;
    // Transfrom.
    transform: Transform = {
        position: {x:0, y:0, z:0, w:0},
        rotation: {x:0, y:0, z:0, w:0}
    }
    // Sprite.
    sprite: Sprite = {
        position: {x:0, y:0, z:0, w:0},
        scale: {x:0, y:0, z:0, w:0},
        rotation: {x:0, y:0, z:0, w:0},
        flipped: false,
        verticies: [
            -1.0, -1.0, 0,
            1.0, -1.0, 0,
            1.0, 1.0, 0,
            -1.0, 1.0, 0,
        ], // square.
        indicies:  [
            0,1,2,0,2,3
        ], // defining triangles from verticies.
        textureCoord:[
            0.0,0.0,
            0.03,0.0,
            0.03,1.0,
            0.0,1.0
        ], // Defining texture coordinates.
        sX: 0,
        sY: 0,
        sWidth: 0,
        sHeight: 0,
        texture: null
    }

    /// Default constructor.
    constructor(){
        this.active = true;
        this.visible = true;
    }

    // Logic update function.
    Update(): void{
        return;
    }
}