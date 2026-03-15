import type { SpriteAnimation } from "../../engine/components/SpriteAnimation";
import { images } from "../../engine/Files";
import { Character } from "./Character";

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
        frameRate: 16,
        animation:[
        ],
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
        frameRate: 16,
        animation:[
        ],
    };
    // Load animations.
    Instantiated(){
        // Load animation.
        this.AnimController.Load(this.anim_idle0);
        this.AnimController.Load(this.anim_walk0);
    };
    // Run state machine.
    Update(){
        super.Update();
        if(this.AnimController.currentAnimation == null){
            this.AnimController.Play(this.anim_idle0);
        };
    };
    // Character state machine.
}