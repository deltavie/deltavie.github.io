import type { Vec4 } from "../dataTypes/Vectors";

export interface Sprite {
    // Destination.
    position: Vec4;
    scale: Vec4;
    rotation: Vec4;
    flipped: boolean;
    verticies: number[]; // Vertex positions for polygon.
    indicies: number[]; // Edges for polygon.
    textureCoord: number[]; // Verticies for texture.
    // Source.
    sX: number;
    sY: number;
    sWidth: number;
    sHeight: number;
    // Texture.
    texture: string | null;
}