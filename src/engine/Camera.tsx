import type { Vec3, Vec4 } from "./dataTypes/Vectors";
import { GameObject } from "./GameObject";

export class Camera extends GameObject{
    // Camera parameters.
    LookAt: Vec3 = {
        x: 0,
        y: 0,
        z: 0,
    }
    Up: Vec3 = {
        x: 0,
        y: 1,
        z: 0,
    }
    constructor(){
        super();
    }
}