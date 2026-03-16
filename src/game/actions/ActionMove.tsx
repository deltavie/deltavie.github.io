import type { SpriteAnimation } from "../../engine/components/SpriteAnimation";
import type { Vec3 } from "../../engine/dataTypes/Vectors";
import { Engine } from "../../engine/Engine";
import { Action } from "./Action";
import { Character } from "../characters/Character";

export class ActionMove extends Action{
    private targetPosition: Vec3;
    private walkSpeed: number;
    walkAnimation: SpriteAnimation;
    // Make new action and assign performer.
    constructor(performer: Character, targetPosition: Vec3, walkSpeed: number, walkAnimation: SpriteAnimation){
        super(performer);
        this.targetPosition = targetPosition;
        this.walkSpeed = walkSpeed;
        this.walkAnimation = walkAnimation;
    }
    // Action logic.
    Update(): void{
        if(!this.ActionPerformer) return;
        // Walk towards target at walkspeed.
        var currentPosition = this.ActionPerformer.transform.position;
        // Get direction vector to target and distance to target.
        var dirVec: Vec3 = {
            x: this.targetPosition.x - currentPosition.x,
            y: this.targetPosition.y - currentPosition.y,
            z: this.targetPosition.z - currentPosition.z
        };
        var distToTarget = Math.sqrt(
            dirVec.x * dirVec.x +
            dirVec.y * dirVec.y +
            dirVec.z * dirVec.z
        );
        var dirVecNormalized: Vec3 = {
            x: dirVec.x/distToTarget,
            y: dirVec.y/distToTarget,
            z: dirVec.z/distToTarget,
        }
        // Move to target else end action.
        if(distToTarget > this.walkSpeed){
            this.ActionPerformer.transform.position.x += dirVecNormalized.x * this.walkSpeed * Engine.deltaTime;
            this.ActionPerformer.transform.position.y += dirVecNormalized.y * this.walkSpeed * Engine.deltaTime;
            this.ActionPerformer.transform.position.z += dirVecNormalized.z * this.walkSpeed * Engine.deltaTime;
            this.ActionPerformer.AnimController.Play(this.walkAnimation);
        }else{
            this.ActionPerformer.CurrentAction = null;
            this.ActionPerformer.AnimController.Stop();
        }
    };
}