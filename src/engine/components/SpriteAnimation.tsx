// How to slice up spritesheet.
interface SheetSettings {
    // Slicing.
    spritesPerRow: number;
    spriteCount: number;
    // Sizing.
    sWidth: number;
    sHeight: number;
}
// Frames in animation.
interface Frame{
    index: number;
    duration: number;
}

export interface SpriteAnimation {
    spritesheet: string | null;
    sheetSettings: SheetSettings;
    animation: Frame[];
}