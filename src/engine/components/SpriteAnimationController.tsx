import { Engine } from "../Engine";
import type { GameObject } from "../GameObject";
import { GetImage, LoadImage } from "../webgl/Images";
import { LoadTexture } from "../webgl/Texture";
import type { SpriteAnimation } from "./SpriteAnimation";

export class SpriteAnimationController{
    elapsedTime: number = 0; //Track how long a frame has been displayed.
    currentAnimation: SpriteAnimation | null = null; // What is the current animation.
    currentFrameIndex: number = 0; // Which frame is currently displayed.
    myObject: GameObject; // Which object to animate.

    constructor(object: GameObject){
        this.myObject = object;
    }

    Play(animation: SpriteAnimation, override: boolean = false){ // Play animation.
        if(this.currentAnimation && override == false){ // If not overriding check if current animation priority >= new animation priority.
            if(animation.animationPriority <= this.currentAnimation.animationPriority) return;
        }
        // Set current animation and reset counters.
        this.currentAnimation = animation;
        this.elapsedTime = 0;
        this.currentFrameIndex = 0;
        // Load animation.
        this.Load(animation);
    }

    Stop(){ // Stop animation.
        this.currentAnimation = null;
    }

    // We will load the spritesheet into individual sprite textures.
    Load(animation: SpriteAnimation){
        if(!animation.spritesheet) return; // No spritesheet.
        // Load whole spritesheet into memory.
        for(var i=0; i < animation.sheetSettings.spriteCount; i++){
            var c = (i % animation.sheetSettings.cols);
            var r = Math.floor(i / animation.sheetSettings.cols);
            var key = `${animation.spritesheet}_${r}_${c}`;
            if(GetImage(key)) continue;
            var x = c*animation.sheetSettings.spriteWidth;
            var y = r*animation.sheetSettings.spriteHeight;
            var segmentWidth = animation.sheetSettings.spriteWidth;
            var segmentHeight = animation.sheetSettings.spriteHeight;
            LoadImage(
                key, 
                animation.spritesheet, 
                {
                    sourceX: x, sourceY: y,
                    width: segmentWidth, height: segmentHeight,
                    orientation: "flipY"
                },
                () => {}
            );
        }
    }

    // Call in update loop to animate.
    Update(){
        if(!this.currentAnimation) return;
        this.elapsedTime += Engine.deltaTime;
        if(this.currentFrameIndex < this.currentAnimation.sheetSettings.spriteCount){ // Try to change frame.
            // Enough time has passed & animation finished conditions.
            if(this.currentAnimation.animation.length > 0){ // Check if animation is defined else just loop through every image in sprite sheet.
                if(this.elapsedTime < this.currentAnimation.animation[this.currentFrameIndex].duration) return; // Not enough time elapsed to change frame.
                if(this.currentFrameIndex > this.currentAnimation.animation.length){
                    this.currentAnimation = null;
                    return;
                }
            }else{
                if(this.elapsedTime < 1/this.currentAnimation.frameRate) return; // Not enough time elapsed to change frame.
                if(this.currentFrameIndex + 1 >= this.currentAnimation.sheetSettings.spriteCount){ // Next frame is out of range/animation ended.
                    this.currentAnimation = null;
                    return;
                }
            }
            // We can change frame now.
            var index = this.currentFrameIndex; // By default loop through every sprite.
            if(this.currentAnimation.animation.length > 0){ // Animation object defines index to use.
                index = this.currentAnimation.animation[this.currentFrameIndex].index;
            }
            this.currentFrameIndex++;
            this.elapsedTime = 0;
            // Calculate new frame.
            var c = (index % this.currentAnimation.sheetSettings.cols);
            var r = Math.floor(index / this.currentAnimation.sheetSettings.cols);
            var x = c*this.currentAnimation.sheetSettings.spriteWidth;
            var y = r*this.currentAnimation.sheetSettings.spriteHeight;
            var segmentWidth = this.currentAnimation.sheetSettings.spriteWidth;
            var segmentHeight = this.currentAnimation.sheetSettings.spriteHeight;
            // Set textures.
            this.myObject.sprite.textureKey = `${this.currentAnimation.spritesheet}_${r}_${c}`;
            this.myObject.sprite.textureImage = LoadImage(
                `${this.currentAnimation.spritesheet}_${r}_${c}`, 
                this.currentAnimation.spritesheet as string, 
                {
                    sourceX: x, sourceY: y,
                    width: segmentWidth, height: segmentHeight,
                    orientation: "flipY"
                },
                () => {}
            );
        }
    }
}