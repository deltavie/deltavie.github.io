// How to slice up spritesheet.
interface SpriteSheetSettings {
    // Slicing.
    rows: number;
    cols: number;
    spriteWidth: number;
    spriteHeight: number;
    spriteCount: number;
    sprites:{};
}
// Frames in animation.
interface Frame{
    index: number;
    duration: number;
}
// Sprite animation interface.
export interface SpriteAnimation {
    spritesheet: string | null;
    sheetSettings: SpriteSheetSettings;
    animation: Frame[];
}