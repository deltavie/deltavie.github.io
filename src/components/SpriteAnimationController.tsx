import { Engine } from "../engine/Engine";
import type { GameObject } from "../engine/GameObject";
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
        if(!this.myObject.spriteImage) this.myObject.spriteImage = new Image();
        this.myObject.spriteImage.src = animation.spritesheet as string;
         // TEMP SET FIRST FRAME!!!
        this.myObject.sprite.sX = 0; // Source position.
        this.myObject.sprite.sY = 0;
        this.myObject.sprite.sWidth = this.currentAnimation.sheetSettings.sWidth; // Source size.
        this.myObject.sprite.sHeight = this.currentAnimation.sheetSettings.sHeight;
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
            this.myObject.sprite.sX = (this.currentFrameIndex % this.currentAnimation.sheetSettings.spritesPerRow) * this.currentAnimation.sheetSettings.sWidth; // Source position.
            this.myObject.sprite.sY = Math.floor(this.currentFrameIndex / this.currentAnimation.sheetSettings.spritesPerRow) * this.currentAnimation.sheetSettings.sWidth;
            this.myObject.sprite.sWidth = this.currentAnimation.sheetSettings.sWidth; // Source size.
            this.myObject.sprite.sHeight = this.currentAnimation.sheetSettings.sHeight;
        }
    }
}