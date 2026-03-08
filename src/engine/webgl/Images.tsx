import { Engine } from "../Engine";

// Keep loaded images here.
var imageLibrary: {[key:string]: ImageBitmap | null} = {};

// Return image based on key.
export function GetImage(key: string, src: string, sourceX: number, sourceY: number, width: number, height: number, orient: ImageOrientation): ImageBitmap | null;
export function GetImage(key: string, src: ImageBitmap, sourceX: number, sourceY: number, width: number, height: number, orient: ImageOrientation): ImageBitmap | null;
export function GetImage(key: string, src: any, sourceX: number, sourceY: number, width: number, height: number, orient: ImageOrientation): ImageBitmap | null{
    if(key in imageLibrary){
        return imageLibrary[key];
    }else{
        if(typeof src === 'string'){
            imageLibrary[key] = null; // Reserve this location.
            const image = new Image();
            image.onload = () =>{
                Promise.all([
                    createImageBitmap(image, sourceX, sourceY, width, height, { imageOrientation: orient})
                ]).then((values) => {
                    imageLibrary[key] = values[0];
                });
            }
            image.src = src;
            return imageLibrary[key];
        }else{
            imageLibrary[key] = null; // Reserve this location.
            Promise.all([
                createImageBitmap(src, sourceX, sourceY, width, height)
            ]).then((values) => {
                imageLibrary[key] = values[0];
            });
            return imageLibrary[key];
        }
    }
}

export function ResizeBitmapForTexture(key: string, imageBitmap: ImageBitmap){
    if(key in imageLibrary) return imageLibrary[key];
    const MaxTexSize = Engine.renderer.MaxTextureSize;
    if(imageBitmap.height > MaxTexSize || imageBitmap.width > MaxTexSize){
        const scaleWidth = MaxTexSize/imageBitmap.width;
        const scaleHeight = MaxTexSize/imageBitmap.height;
        const scale = Math.min(scaleHeight, scaleWidth); // Get the smaller scale or largest dim must fit max texsize.
        Promise.all([
            resizeBitmap(imageBitmap, imageBitmap.width*scale, imageBitmap.height*scale)
        ]).then((values) => {
            imageLibrary[key] = values[0];
        });
        return imageLibrary[key];
    }else{
        imageLibrary[key] = imageBitmap;
        return imageLibrary[key];
    }
}

async function resizeBitmap(imageBitmap: ImageBitmap, targetWidth: number, targetHeight: number) {
    // create an off-screen canvas
    const canvas = (typeof OffscreenCanvas !== "undefined")
        ? new OffscreenCanvas(targetWidth, targetHeight)
        : Object.assign(document.createElement("canvas"), { width: targetWidth, height: targetHeight });
    const ctx = canvas.getContext("2d");
    if(ctx) ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
    // Convert back to ImageBitmap
    return await createImageBitmap(canvas);
}
