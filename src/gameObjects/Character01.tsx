import type { SpriteAnimation } from "../components/SpriteAnimation";
import { Engine } from "../engine/Engine";
import { images } from "../engine/Files";
import { Character } from "./Character";

export class Character01 extends Character{
    // Animations.
    anim_idle0: SpriteAnimation = {
        spritesheet: images["idle_0.gif_31_spritesheet.png"],
        sheetSettings: {
            spritesPerRow: 31,
            spriteCount: 31,
            sWidth: 512,
            sHeight: 512,
        },
        animation:[
        ],
    };

    constructor(){
        super();
        this.sprite.height = 512;
        this.sprite.width = 512;
    }

    Update(){
        super.Update();
        if(this.AnimController.currentAnimation == null){
            this.AnimController.Play(this.anim_idle0);
        };
        this.transform.x = Engine.mouse?.elX as number;
        this.transform.y = Engine.mouse?.elY as number;
    }
}