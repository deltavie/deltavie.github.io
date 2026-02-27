import { SpriteAnimationController } from "../components/SpriteAnimationController";

interface Transform {
    // Position.
    x: number;
    y: number;
    // Layer.
    zIndex: number;
}

interface Sprite {
    // Destination size.
    width: number;
    height: number;
    // Source size.
    sX: number;
    sY: number;
    sWidth: number;
    sHeight: number;
}

export class GameObject{
    // State.
    active: boolean;
    visible: boolean;
    // Transfrom.
    transform: Transform = {
        x: 0,
        y: 0,
        zIndex: 0,
    }
    // Sprite.
    sprite: Sprite = {
        width: 0,
        height: 0,
        sX: 0,
        sY: 0,
        sWidth: 0,
        sHeight: 0,
    }
    spriteImage: HTMLImageElement | null = null;

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