import { GameObject } from "../engine/GameObject";
import { SpriteAnimationController } from "../components/SpriteAnimationController";
import { Engine } from "../engine/Engine";

export class Character extends GameObject{
    // Components
    AnimController: SpriteAnimationController = new SpriteAnimationController(this);

    constructor(){
        super()
    }

    Update(): void {
        super.Update();
        this.AnimController.Update(Engine.deltaTime);
    }
}