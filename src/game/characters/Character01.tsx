import type { SpriteAnimation } from "../../engine/components/SpriteAnimation";
import { Engine } from "../../engine/Engine";
import { images } from "../../engine/Files";
import { Character } from "./Character";
import { ActionMove } from "../actions/ActionMove"
import type { Vec3, Vec2 } from "../../engine/dataTypes/Vectors";

export class Character01 extends Character{
    // Animations.
    anim_idle0: SpriteAnimation = {
        spritesheet: images["idle_0.gif_31_spritesheet.png"],
        sheetSettings: {
            rows: 1,
            cols: 31,
            spriteWidth: 256,
            spriteHeight: 256,
            spriteCount: 31
        },
        frameRate: 24,
        animation:[
        ],
        animationPriority: 0,
    };
    anim_walk0: SpriteAnimation = {
        spritesheet: images["walk_0.gif_31_spritesheet.png"],
        sheetSettings: {
            rows: 1,
            cols: 31,
            spriteWidth: 256,
            spriteHeight: 256,
            spriteCount: 31
        },
        frameRate: 24,
        animation:[
        ],
        animationPriority: 20,
    };
    // Load animations.
    Instantiated(){
        // Load animation.
        this.AnimController.Load(this.anim_idle0);
        this.AnimController.Load(this.anim_walk0);
    };
    // Change direction this character is facing.
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
    // Run state machine.
    Update(){
        super.Update();
        this.StateController();
    };
    // Character state machine.
    private myState: BehaviourState = BehaviourState.IDLE;
    private myBehaviourStats: BehaviourStatus = {
        CheckActionTimer: 0,
        CheckActionInterval: 1,
        ActionChance: 0,
        ActionChanceIncrease: 5,
    }
    private RandomMoveRange: Vec2 = {
        x: 4,
        y: 4,
    }
    private StateController(){
        switch(this.myState){
            case BehaviourState.IDLE: {
                // 1. Play idle animation.
                // 2. Increasing chance to peform another action with time passed.
                this.AnimController.Play(this.anim_idle0);
                if(this.myBehaviourStats.CheckActionTimer > this.myBehaviourStats.CheckActionInterval){
                    this.myBehaviourStats.CheckActionTimer = 0; // Chance to perform an action.
                    var performAction = false;
                    if(Math.random()*100 < this.myBehaviourStats.ActionChance){
                        this.myBehaviourStats.ActionChance = 0;
                        performAction = true;
                    }else{
                        this.myBehaviourStats.ActionChance += this.myBehaviourStats.ActionChanceIncrease
                    }
                    if(performAction){ // Perform an action.
                        var TargetPosition = {
                            x: Math.random()*this.RandomMoveRange.x - this.RandomMoveRange.x/2,
                            y: this.transform.position.y,
                            z: Math.random()*this.RandomMoveRange.y - this.RandomMoveRange.y/2,
                        }
                        this.Face(TargetPosition);
                        this.CurrentAction = new ActionMove(this, TargetPosition, 0.6, this.anim_walk0);
                        this.myState = BehaviourState.WALK;
                    }
                }else{
                    this.myBehaviourStats.CheckActionTimer += Engine.deltaTime;
                }
                break;
            }
            case BehaviourState.WALK: {
                if(this.CurrentAction == null){
                    this.myState = BehaviourState.IDLE;
                }
                break;
            }
            default: {
                this.myState = BehaviourState.IDLE;
            }
        }
    }
}

interface BehaviourStatus{
    CheckActionTimer: number,
    CheckActionInterval: number,
    ActionChance: number,
    ActionChanceIncrease: number,
}

enum BehaviourState {
    IDLE,
    WALK
}