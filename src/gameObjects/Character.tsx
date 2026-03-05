import { GameObject } from "../engine/GameObject";
import { SpriteAnimationController } from "../engine/components/SpriteAnimationController";

export class Character extends GameObject{
    // Components
    AnimController: SpriteAnimationController = new SpriteAnimationController(this);

    constructor(){
        super()
    }

    Update(): void {
        super.Update();
        this.AnimController.Update();
    }
}