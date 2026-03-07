import { Engine } from "../Engine";
import type { GameObject } from "../GameObject";
import type { SpriteAnimation } from "./SpriteAnimation";

export class SpriteAnimationController{
    elapsedTime: number = 0; //Track how long a frame has been displayed.
    currentAnimation: SpriteAnimation | null = null; // What is the current animation.
    currentFrameIndex: number = 0; // Which frame is currently displayed.
    myObject: GameObject; // Which object to animate.

    constructor(object: GameObject){
        this.myObject = object;
    }

    Play(animation: SpriteAnimation){
        // Set current animation and reset counters.
        this.currentAnimation = animation;
        this.elapsedTime = 0;
        this.currentFrameIndex = 0;
        // Set object sprite.
        this.myObject.sprite.texture = animation.spritesheet as string;
    }

    // Call in update loop to animate.
    Update(){ // No checks! Make sure animation settings are NOT invalid.
        if(!this.currentAnimation) return;
        this.elapsedTime += Engine.deltaTime;
        if(this.currentFrameIndex < this.currentAnimation.sheetSettings.spriteCount){ // Try to change frame.
            if(this.currentAnimation.animation.length > 0){ // Check if animation is defined else just loop through every image in sprite sheet.
                if(this.elapsedTime < this.currentAnimation.animation[this.currentFrameIndex].duration) return; // Not enough time elapsed to change frame.
            }else{
                if(this.elapsedTime < 33) return; // Not enough time elapsed to change frame.
            }
            if(this.currentFrameIndex + 1 >= this.currentAnimation.sheetSettings.spriteCount){ // Next frame is out of range/animation ended.
                this.currentAnimation = null;
                return;
            }
            // We can change frame now.
            this.currentFrameIndex++;
            this.elapsedTime = 0;
            var width = 1/this.currentAnimation.sheetSettings.cols;
            var height = 1/this.currentAnimation.sheetSettings.rows;
            var x = (this.currentFrameIndex % this.currentAnimation.sheetSettings.cols) * width;
            var y = Math.floor(this.currentFrameIndex / this.currentAnimation.sheetSettings.cols) * height;
            this.myObject.sprite.textureCoord = 
            [
                x, y,
                x+width, y,
                x+width, y+height,
                x, y+height
            ]
        }
    }
}