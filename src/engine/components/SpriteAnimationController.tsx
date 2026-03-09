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

    // Play animation.
    Play(animation: SpriteAnimation){
        // Set current animation and reset counters.
        this.currentAnimation = animation;
        this.elapsedTime = 0;
        this.currentFrameIndex = 0;
        // Load animation.
        this.Load(animation);
    }

    // We will load the spritesheet into individual sprite textures.
    Load(animation: SpriteAnimation){
        if(!animation.spritesheet) return; // No spritesheet.
        if(!Engine.renderer.glContext) return; // No gl context.
        // Load whole spritesheet into memory.
        var width = animation.sheetSettings.cols * animation.sheetSettings.spriteWidth;
        var height = animation.sheetSettings.rows * animation.sheetSettings.spriteHeight;
        LoadImage(
            `${animation.spritesheet}`, 
            animation.spritesheet, 
            {
                sourceX: 0, sourceY: 0,
                width: width, height: height,
                orientation: "flipY"
            },
            (image: ImageBitmap) => {
                // Load sprites in sheet as individual textures.
                for(var i=0; i < animation.sheetSettings.spriteCount; i++){
                    var c = (i % animation.sheetSettings.cols);
                    var r = Math.floor(i / animation.sheetSettings.cols);
                    var key = `${animation.spritesheet}_${r}_${c}`;
                    if(!Engine.renderer.glContext) continue;
                    if(LoadTexture(Engine.renderer.glContext, key, null)) continue;
                    var x = c*animation.sheetSettings.spriteWidth;
                    var y = r*animation.sheetSettings.spriteHeight;
                    var segmentWidth = animation.sheetSettings.spriteWidth;
                    var segmentHeight = animation.sheetSettings.spriteHeight;
                    Promise.all([
                        createImageBitmap(image, x, y, segmentWidth, segmentHeight),
                        c,
                        r,
                    ]).then((values) => { 
                        var newkey = `${animation.spritesheet}_${values[2]}_${values[1]}`;
                        LoadTexture(Engine.renderer.glContext, newkey, values[0])
                    });
                }
            }
        );
    }

    // Call in update loop to animate.
    Update(){
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
            // Calculate new frame.
            var c = (this.currentFrameIndex % this.currentAnimation.sheetSettings.cols);
            var r = Math.floor(this.currentFrameIndex / this.currentAnimation.sheetSettings.cols);
            this.myObject.sprite.textureKey = `${this.currentAnimation.spritesheet}_${r}_${c}`;
        }
    }
}