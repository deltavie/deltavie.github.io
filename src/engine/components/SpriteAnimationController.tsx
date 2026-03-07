import { Engine } from "../Engine";
import type { GameObject } from "../GameObject";
import { GetImage } from "../webgl/Images";
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
        // Load animation.
        this.Load(animation);
    }

    // FIND A BETTER WAY TO LOAD SPRITESHEETS!!!!!
    // CUT SPRITE SHEETS INTO 2048/2048 max sized sheets?
    // Get index
    // Identify which segment the sprite is in
    // Identify which sprite in the segment it is
    // Load segement as texture
    // Change texcords to match sprite position in segment
    Load(animation: SpriteAnimation){
        if(!animation.spritesheet) return; // No spritesheet.
        this.myObject.sprite.textureKey = animation.spritesheet;
        // Load sprite sheet into individual images.
        for(var i=0; i < animation.sheetSettings.spriteCount; i++){
            var width = animation.sheetSettings.width;
            var height = animation.sheetSettings.height;
            var x = (i % animation.sheetSettings.cols) * width;
            var y = Math.floor(i / animation.sheetSettings.cols) * height;
            GetImage(`${animation.spritesheet}_${i}`, animation.spritesheet, x, y, width, height); //Load images.
        }
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
            // var width = 1/this.currentAnimation.sheetSettings.cols;
            // var height = 1/this.currentAnimation.sheetSettings.rows;
            // var x = (this.currentFrameIndex % this.currentAnimation.sheetSettings.cols) * width;
            // var y = Math.floor(this.currentFrameIndex / this.currentAnimation.sheetSettings.cols) * height;
            // this.myObject.sprite.textureCoord = 
            // [
            //     x, y,
            //     x+width, y,
            //     x+width, y+height,
            //     x, y+height
            // ]
            var width = this.currentAnimation.sheetSettings.width;
            var height = this.currentAnimation.sheetSettings.height;
            var x = (this.currentFrameIndex % this.currentAnimation.sheetSettings.cols) * width;
            var y = Math.floor(this.currentFrameIndex / this.currentAnimation.sheetSettings.cols) * height;
            this.myObject.sprite.textureImage = GetImage(`${this.currentAnimation.spritesheet}_${this.currentFrameIndex}`, this.currentAnimation.spritesheet as string, x, y, width, height);
            this.myObject.sprite.textureKey = `${this.currentAnimation.spritesheet}_${this.currentFrameIndex}`;
        }
    }
}