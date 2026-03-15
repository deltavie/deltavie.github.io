import { GameObject } from "../../engine/GameObject";
import { SpriteAnimationController } from "../../engine/components/SpriteAnimationController";
import type { Action } from "../actions/Action";

export class Character extends GameObject{
    // Components.
    AnimController: SpriteAnimationController = new SpriteAnimationController(this);

    // Actions.
    CurrentAction: Action | null = null;

    constructor(){
        super()
    }

    Update(): void {
        // Update components and current action.
        super.Update();
        this.AnimController.Update();
        if(this.CurrentAction) this.CurrentAction.Update();
    }
}