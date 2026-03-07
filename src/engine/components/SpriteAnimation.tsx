// How to slice up spritesheet.
interface SpriteSheetSettings {
    // Slicing.
    rows: number;
    cols: number;
    width: number;
    height: number;
    spriteCount: number;
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