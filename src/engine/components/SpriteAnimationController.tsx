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

    // Play animation.
    Play(animation: SpriteAnimation){
        // Set current animation and reset counters.
        this.currentAnimation = animation;
        this.elapsedTime = 0;
        this.currentFrameIndex = 0;
        // Load animation.
        this.Load(animation);
    }

    // Load spritesheet into segements that are at most MaxTextureSize*MaxTextureSize for WebGL
    // We will load sheets starting from the top left going to the bottom right.
    Load(animation: SpriteAnimation){
        if(!animation.spritesheet) return; // No spritesheet.
        // Calc number of segements to generate.
        var MaxSize = Engine.renderer.MaxTextureSize;
        var width = animation.sheetSettings.cols * animation.sheetSettings.spriteWidth;
        var height = animation.sheetSettings.rows * animation.sheetSettings.spriteHeight; 
        var cols = Math.ceil(width/MaxSize);
        var rows = Math.ceil(height/MaxSize);
        // Generate segements.
        for(var r=0; r < rows; r++){
            for(var c=0; c < cols; c++){
                var x = c*MaxSize;
                var y = r*MaxSize;
                var segmentWidth = MaxSize; // Max size or remainder size.
                if(width-(c+1)*MaxSize < 0) segmentWidth = width-c*MaxSize;
                var segmentHeight = MaxSize;
                if(height-(r+1)*MaxSize < 0) segmentHeight = height-r*MaxSize;
                GetImage(`${animation.spritesheet}_${r}_${c}`, animation.spritesheet, x, y, segmentWidth, segmentHeight, "flipY"); //Load images.
            }
        }
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
            var spriteWidth = this.currentAnimation.sheetSettings.spriteWidth;
            var spriteHeight = this.currentAnimation.sheetSettings.spriteHeight;
            var x = (this.currentFrameIndex % this.currentAnimation.sheetSettings.cols) * spriteWidth;
            var y = Math.floor(this.currentFrameIndex / this.currentAnimation.sheetSettings.cols) * spriteHeight;
            // Find segement based on x,y position.
            var MaxSize = Engine.renderer.MaxTextureSize;
            var width = this.currentAnimation.sheetSettings.cols * this.currentAnimation.sheetSettings.spriteWidth;
            var height = this.currentAnimation.sheetSettings.rows * this.currentAnimation.sheetSettings.spriteHeight;
            var c = Math.floor(x/MaxSize);
            var r = Math.floor(y/MaxSize);
            var segmentWidth = MaxSize; // Max size or remainder size.
            if(width-(c+1)*MaxSize < 0) segmentWidth = width-c*MaxSize;
            var segmentHeight = MaxSize;
            if(height-(r+1)*MaxSize < 0) segmentHeight = height-r*MaxSize;
            this.myObject.sprite.textureImage = GetImage(`${this.currentAnimation.spritesheet}_${r}_${c}`, this.currentAnimation.spritesheet as string, 0, 0, segmentWidth, segmentHeight, "flipY");
            this.myObject.sprite.textureKey = `${this.currentAnimation.spritesheet}_${r}_${c}`;
            // Find texcoords position based on x,y and segment.
            var texWidth = this.currentAnimation.sheetSettings.spriteWidth/segmentWidth;
            var texHeight = this.currentAnimation.sheetSettings.spriteHeight/segmentHeight;
            var texX = (x - c*MaxSize)/segmentWidth;
            var texY = (y - r*MaxSize)/segmentHeight;
            this.myObject.sprite.textureCoord = 
            [
                texX, texY,
                texX+texWidth, texY,
                texX+texWidth, texY+texHeight,
                texX, texY+texHeight
            ]
        }
    }
}