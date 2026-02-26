interface Transform {
    // Destination transform.
    x: number;
    y: number;
    width: number;
    height: number;
    // Source transform.
    sX: number;
    sY: number;
    sWidth: number;
    sHeight: number;
    // Layer.
    zIndex: number;
}

export class GameObject{
    // State.
    active: boolean;
    visible: boolean;
    // Transfrom.
    transform: Transform = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        sX: 0,
        sY: 0,
        sWidth: 0,
        sHeight: 0,
        zIndex: 0,
    }
    // Sprite.
    sprite: HTMLImageElement | null = null;

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