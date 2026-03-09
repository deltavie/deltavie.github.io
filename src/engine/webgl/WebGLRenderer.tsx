import type { GameObject } from "../GameObject.js";
// @ts-ignore this file SHOULD be imported fine
import {vec3, vec4, mat4} from "./gl-matrix-min.js"
import { GetDefaultTexture, GetTexture } from "./Texture.js";

//https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
// Vertex shader program.
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;
// Fragment shader program.
const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
      if(gl_FragColor == vec4(0.000, 0.000, 0.000, 0.000)) discard;
    }
  `;
// if(gl_FragColor == vec4(0.000, 0.000, 0.000, 0.000)) discard;
// texture transparency hack, can't have semi-transparent but can have fully transparent
// need to find a solution for semi transparency

// Collect all the info needed to use the shader program.
// Look up which attribute our shader program is using
// for aVertexPosition and look up uniform locations.
interface glProgramInfo{
    shaderProgram: WebGLProgram | null;
    attribLocations: {
        vertexPosition: any;
        textureCoord: any;
    };
    uniformLocations: {
        projectionMatrix: any;
        modelViewMatrix: any;
        uSampler: any;
    };
}
// Main program.
export class webglRenderer{
    // GL parameters.
    glContext: WebGL2RenderingContext | null = null;
    programInfo: glProgramInfo = {
        shaderProgram: null,
        attribLocations: {
            vertexPosition: null,
            textureCoord: null,
        },
        uniformLocations: {
            projectionMatrix: null,
            modelViewMatrix: null,
            uSampler: null
        }
    }
    MaxTextureSize: number = 4096; // When loading textures we cannot exceed this size.
    // Initial webgl instance.
    Initialize(canvas: HTMLCanvasElement){
        // Initialize the GL context
        this.glContext = canvas.getContext("webgl2");
         // Only continue if WebGL is available and working
        if (this.glContext === null) {
            alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
            );
            return;
        }
        // Set clear color to black, fully opaque
        this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
        // Initialize a shader program; this is where all the lighting
        // for the vertices and so forth is established.
        this.programInfo.shaderProgram = initShaderProgram(this.glContext, vsSource, fsSource);
        this.programInfo.attribLocations = {
            vertexPosition: this.glContext.getAttribLocation(this.programInfo.shaderProgram as WebGLProgram, "aVertexPosition"),
            textureCoord: this.glContext.getAttribLocation(this.programInfo.shaderProgram as WebGLProgram, "aTextureCoord"),
        };
        this.programInfo.uniformLocations = {
            projectionMatrix: this.glContext.getUniformLocation(this.programInfo.shaderProgram as WebGLProgram, "uProjectionMatrix"),
            modelViewMatrix: this.glContext.getUniformLocation(this.programInfo.shaderProgram as WebGLProgram, "uModelViewMatrix"),
            uSampler: this.glContext.getUniformLocation(this.programInfo.shaderProgram as WebGLProgram, "uSampler"),
        };
        // Enable attribute arrays
        this.glContext.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
        this.glContext.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
        // Get parameters.
        this.MaxTextureSize = this.glContext.getParameter(this.glContext.MAX_TEXTURE_SIZE)/8;
    }
    // Render loop.
    Render(gameObjects: GameObject[], camera: GameObject){
        if(!this.glContext) return;
        if(gameObjects.length <= 0) return;
        // Draw the scene
        drawScene(this.glContext, this.programInfo, gameObjects, camera);
    }
}
//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(glContext: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
    if (glContext === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return null;
    }
    const vertexShader: WebGLShader = loadShader(glContext, glContext.VERTEX_SHADER, vsSource) as WebGLShader;
    const fragmentShader: WebGLShader = loadShader(glContext, glContext.FRAGMENT_SHADER, fsSource) as WebGLShader;
    // Create the shader program
    const shaderProgram = glContext.createProgram();
    glContext.attachShader(shaderProgram, vertexShader);
    glContext.attachShader(shaderProgram, fragmentShader);
    glContext.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
        alert(
            `Unable to initialize the shader program: ${glContext.getProgramInfoLog(
                shaderProgram,
            )}`,
        );
        return null;
    }
    return shaderProgram;
}
//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(glContext: WebGL2RenderingContext, type: number, source: string) {
    if (glContext === null) {
        alert(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
        );
        return;
    }
    const shader: WebGLShader = glContext.createShader(type) as WebGLShader;
    // Send the source to the shader object
    glContext.shaderSource(shader, source);
    // Compile the shader program
    glContext.compileShader(shader);
    // See if it compiled successfully
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        alert(
            `An error occurred compiling the shaders: ${glContext.getShaderInfoLog(shader)}`,
        );
        glContext.deleteShader(shader);
        return null;
    }
    return shader;
}
//
// Main render loop!
//
function drawScene(glContext: WebGL2RenderingContext, programInfo: glProgramInfo, gameObjects: GameObject[], camera: GameObject) {
    glContext.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    glContext.clearDepth(1.0); // Clear everything
    glContext.enable(glContext.DEPTH_TEST); // Enable depth testing
    glContext.depthFunc(glContext.LEQUAL); // Near things obscure far things
    glContext.enable(glContext.BLEND); // Enable blending
    glContext.blendFunc(glContext.SRC_ALPHA, glContext.ONE_MINUS_SRC_ALPHA); // Set the blending function
    // Flip image pixels into the bottom-to-top order that WebGL expects.
    glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
    // Clear the canvas before we start drawing on it.
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    // Create a perspective matrix.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = glContext.canvas.width / glContext.canvas.height;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    // note: glMatrix always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    // Objects we'll be drawing.
    for(var i=0; i < gameObjects.length; i ++){
        var gameObject = gameObjects[i];
        const buffers = initBuffers(glContext, gameObject);
        // Load texture.
        var texture = null;
        if(gameObject.sprite.textureKey) texture = GetTexture(gameObject.sprite.textureKey);
        if(!texture) texture = GetDefaultTexture(glContext); // fallback.
        // Create a new matrix for the object with the center as origin.
        const modelViewMatrix = mat4.create();
        // Move the object relative to the camera position.
        mat4.translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [
                gameObject.transform.position.x - camera.transform.position.x,
                gameObject.transform.position.y - camera.transform.position.y,
                gameObject.transform.position.z - camera.transform.position.z,
            ],
        ); // amount to translate.
        // Apply rotations on the object about x/y/z axis.
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            gameObject.transform.rotation.x,
            [1, 0, 0]
        );
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            gameObject.transform.rotation.y,
            [0, 1, 0]
        );
        mat4.rotate(
            modelViewMatrix,
            modelViewMatrix,
            gameObject.transform.rotation.z,
            [0, 0, 1]
        );
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        setPositionAttribute(glContext, buffers, programInfo);
        // textureCoord attribute.
        setTextureAttribute(glContext, buffers, programInfo);
        // Tell WebGL which indices to use to index the vertices
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, buffers.indices);
        // Tell WebGL to use our program when drawing
        glContext.useProgram(programInfo.shaderProgram);
        // Set the shader uniforms
        glContext.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix,
        );
        glContext.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix,
        );
        // Tell WebGL we want to affect texture unit 0
        // Write a function to record active textures and use when needed.
        glContext.activeTexture(glContext.TEXTURE0);
        // Bind the texture to texture unit 0
        glContext.bindTexture(glContext.TEXTURE_2D, texture);
        // Tell the shader we bound the texture to texture unit 0
        glContext.uniform1i(programInfo.uniformLocations.uSampler, 0);
        {
            const vertexCount = buffers.vertexCount;
            const type = glContext.UNSIGNED_SHORT;
            const offset = 0;
            glContext.drawElements(glContext.TRIANGLES, vertexCount, type, offset);
        }
    }
}
//
// Make buffers for object.
//
function initBuffers(glContext: WebGL2RenderingContext, gameObject: GameObject) {
    const positionBuffer = initPositionBuffer(glContext, gameObject);
    const indexBufferInfo = initIndexBuffer(glContext, gameObject);
    const textureCoordBuffer = initTextureBuffer(glContext, gameObject)
    return {
        position: positionBuffer,
        vertexCount: indexBufferInfo.vertexCount,
        indices: indexBufferInfo.indexBuffer,
        textureCoord: textureCoordBuffer
    };
}
//
// Vertex buffers.
//
// Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
function setPositionAttribute(glContext: WebGL2RenderingContext, buffers: any, programInfo: glProgramInfo) {
    const numComponents = 3; // pull out 3 values per iteration
    const type = glContext.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    const offset = 0; // how many bytes inside the buffer to start from
    glContext.bindBuffer(glContext.ARRAY_BUFFER, buffers.position);
    glContext.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    //glContext.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}
// Make position buffer for object.
function initPositionBuffer(glContext: WebGL2RenderingContext,  gameObject: GameObject){
    // Create a buffer for the square's positions.
    const positionBuffer = glContext.createBuffer();
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    glContext.bindBuffer(glContext.ARRAY_BUFFER, positionBuffer);
    // Now create an array of positions for all objects
    var positions: number[] = gameObject.sprite.verticies;
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(positions), glContext.STATIC_DRAW);
    return positionBuffer;
}
interface indexBufferInfo{
    indexBuffer: WebGLBuffer;
    vertexCount: number;
}
// Make vertex buffer for object.
function initIndexBuffer(glContext: WebGL2RenderingContext,  gameObject: GameObject): indexBufferInfo{
    const indexBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    var indices: number[] = gameObject.sprite.indicies;
    // Now send the element array to GL
    glContext.bufferData(
        glContext.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        glContext.STATIC_DRAW,
    );
    return {
        indexBuffer: indexBuffer,
        vertexCount: indices.length
    };
}
//
// Texture buffers.
//
// tell webgl how to pull out the texture coordinates from buffer
function setTextureAttribute(glContext: WebGL2RenderingContext, buffers: any, programInfo: glProgramInfo) {
  const num = 2; // every coordinate composed of 2 values
  const type = glContext.FLOAT; // the data in the buffer is 32-bit float
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set to the next
  const offset = 0; // how many bytes inside the buffer to start from
  glContext.bindBuffer(glContext.ARRAY_BUFFER, buffers.textureCoord);
  glContext.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset,
  );
  //glContext.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}
// Make texture buffer.
function initTextureBuffer(glContext: WebGL2RenderingContext,  gameObject: GameObject) {
    const textureCoordBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, textureCoordBuffer);
    // Define mapping of texture.
    var textureCoord: number[] = gameObject.sprite.textureCoord;
    // Send mapping to GL array
    glContext.bufferData(
        glContext.ARRAY_BUFFER,
        new Float32Array(textureCoord),
        glContext.STATIC_DRAW,
    );
    return textureCoordBuffer;
}