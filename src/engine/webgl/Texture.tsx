
// Keep loaded textures here.
var textureLibrary: {[key:string]: WebGLTexture} = {};
var DefaultTexture:WebGLTexture | null = null;

// Return texture if key exists.
export function GetTexture(key: string): WebGLTexture | null {
    if(key in textureLibrary) return textureLibrary[key];
    return null;
}

// Return texture if loaded else load it.
export function LoadTexture(glContext: WebGL2RenderingContext, key: string, image: HTMLImageElement | ImageBitmap | null): WebGLTexture | null{
    if(key in textureLibrary) return textureLibrary[key];
    // Try to load texture.
    if(!image) return null; // No image to load.
    const texture = NewTexture(glContext, image)
    if(!texture) return null; // No texture loaded.
    textureLibrary[key] = texture;
    return texture;
}

// Get fallback texture.
export function GetDefaultTexture(glContext: WebGL2RenderingContext): WebGLTexture{
    if(DefaultTexture) return DefaultTexture;
    DefaultTexture = glContext.createTexture();
    glContext.bindTexture(glContext.TEXTURE_2D, DefaultTexture);
    const level = 0;
    const internalFormat = glContext.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = glContext.RGBA;
    const srcType = glContext.UNSIGNED_BYTE;
    const pixels = new Uint8Array([255,255,255,255]);
    glContext.texImage2D(
        glContext.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixels
    )
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.REPEAT);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.REPEAT);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
    return DefaultTexture;
}

// Initialize a texture and save it.
function NewTexture(glContext: WebGL2RenderingContext, image: HTMLImageElement | ImageBitmap): WebGLTexture{
    const texture = glContext.createTexture();
    glContext.bindTexture(glContext.TEXTURE_2D, texture);
    // Create a texture with a single pixel while waiting for texture to load.
    const level = 0;
    const internalFormat = glContext.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = glContext.RGBA;
    const srcType = glContext.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255,255,255,255])
    glContext.texImage2D(
        glContext.TEXTURE_2D,
        level,
        internalFormat,
        width,
        height,
        border,
        srcFormat,
        srcType,
        pixel
    )
    // Bind image.
    glContext.bindTexture(glContext.TEXTURE_2D, texture);
    glContext.texImage2D(
        glContext.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
    )
    // I don't know what is fucking wrong with the mipmaps
    // WebGL1 requirements for power of 2 images.
    //if(isPowerOf2(image.width)&&isPowerOf2(image.height)){
    //    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
    //    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
    //    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_LINEAR);
    //    glContext.generateMipmap(glContext.TEXTURE_2D);
    //}else{
        // Turn off mips and clamp texture to edge.
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR);
    //}
    return texture;
}

function isPowerOf2(value:number):boolean{
    // 0001 & 0000 = 0000 == 0
    // 0011 & 0010 = 0010 != 0
    return(value & (value-1)) === 0;
}