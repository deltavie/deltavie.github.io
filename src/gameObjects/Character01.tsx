import type { SpriteAnimation } from "../engine/components/SpriteAnimation";
import { Engine } from "../engine/Engine";
import { images } from "../engine/Files";
import { Character } from "./Character";

var count = 1;
export class Character01 extends Character{
    // Animations.
    anim_idle0: SpriteAnimation = {
        spritesheet: images["idle_0.gif_31_spritesheet.png"],
        sheetSettings: {
            rows: 1,
            cols: 31,
            spriteCount: 31
        },
        animation:[
        ],
    };

    direction = false;
    constructor(){
        super();
        if(count%2==0) this.direction = true;
        count++;
    }

    elapsedtime = 0;
    Update(){
        super.Update();
        if(this.AnimController.currentAnimation == null){
            this.AnimController.Play(this.anim_idle0);
        };
        this.elapsedtime += Engine.deltaTime/1000;
        if(this.direction){
            this.transform.position.x = Math.sin(this.elapsedtime);
            //this.transform.position.y = Math.cos(this.elapsedtime);
            this.transform.position.z = Math.cos(this.elapsedtime);
        }else{
            this.transform.position.x = -Math.sin(this.elapsedtime);
            //this.transform.position.y = -Math.cos(this.elapsedtime);
            this.transform.position.z = -Math.cos(this.elapsedtime);
            this.transform.rotation.y = Math.PI;
        }
        //this.transform.rotation.x = Math.sin(this.elapsedtime)*3;
        //this.transform.rotation.y = Math.cos(this.elapsedtime)*3;
        //this.transform.rotation.z = Math.tan(this.elapsedtime)*3;
    }
}