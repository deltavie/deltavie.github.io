import { GameObject } from "../../engine/GameObject";
import { SpriteAnimationController } from "../../engine/components/SpriteAnimationController";
import type { Vec3 } from "../../engine/dataTypes/Vectors";
import type { Action } from "../actions/Action";

export class Character extends GameObject{
    // Components.
    AnimController: SpriteAnimationController = new SpriteAnimationController(this);

    // Actions.
    CurrentAction: Action | null = null;

    constructor(){
        super()
    }

    // Make character face a vector.
    Face(direction: Vec3): void {
        if(direction.x >= this.transform.position.x){
            this.sprite.textureCoord = [
                1.0,0.0,
                0.0,0.0,
                0.0,1.0,
                1.0,1.0
            ]
        }else{
            this.sprite.textureCoord = [
                0.0,0.0,
                1.0,0.0,
                1.0,1.0,
                0.0,1.0
            ]
        }
    };

    // Logic loop.
    Update(): void {
        // Update components and current action.
        super.Update();
        this.AnimController.Update();
        if(this.CurrentAction) this.CurrentAction.Update();
    }
}