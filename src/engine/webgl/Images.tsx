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