// Keep loaded images here.
var imageLibrary: {[key:string]: ImageBitmap} = {};

// Return image based on key.
export function GetImage(key: string, src: string, sourceX: number, sourceY: number, width: number, height: number): ImageBitmap | null{
    if(key in imageLibrary){
        return imageLibrary[key];
    }else{
        // Try to load texture.
        const image = new Image();
        image.onload = () =>{
            Promise.all([
                createImageBitmap(image, sourceX, sourceY, width, height, { imageOrientation: "flipY" })
            ]).then((values) => {
                imageLibrary[key] = values[0];
            });
        }
        image.src = src;
        return imageLibrary[key];
    }
}